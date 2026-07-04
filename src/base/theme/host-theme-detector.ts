/**
 * Host theme detector — detects dark/light mode from the host page (Moodle, WordPress, etc.)
 *
 * Designed to be defensive: each host CMS/theme may implement dark mode differently.
 * Detection is read-only — never modifies the host's DOM, classes, or localStorage.
 *
 * Priority order:
 *   1. Class/attribute on <html> and <body>
 *   2. Known localStorage keys (scan, not assume)
 *   3. prefers-color-scheme media query (OS fallback)
 *
 * @see ADR-807 — CSS isolation via .middag-root
 */

export type DetectedTheme = "dark" | "light" | "auto";

// ── Class/attribute patterns ────────────────────────────────────────────────

/** CSS classes that indicate dark mode on <html> or <body> */
const DARK_CLASS_PATTERNS = [
  "dark",
  "theme-dark",
  "dark-mode",
  "darkmode",
  "is-dark",
  "night",
  "bp-dark", // Boost Plus
] as const;

/** data-* attributes checked on <html> and <body> */
const DARK_ATTRIBUTE_CHECKS: { attr: string; value: string }[] = [
  { attr: "data-theme", value: "dark" },
  { attr: "data-bs-theme", value: "dark" }, // Bootstrap 5.3+
  { attr: "data-color-scheme", value: "dark" },
  { attr: "data-color-mode", value: "dark" }, // GitHub-style
  { attr: "data-moodle-theme-mode", value: "dark" },
  { attr: "data-wp-dark", value: "true" }, // WP dark mode plugins
];

/** Scan element for dark mode indicators */
function elementHasDarkIndicator(el: Element): boolean {
  const classes = el.classList;
  for (const pattern of DARK_CLASS_PATTERNS) {
    if (classes.contains(pattern)) return true;
  }

  for (const { attr, value } of DARK_ATTRIBUTE_CHECKS) {
    if (el.getAttribute(attr) === value) return true;
  }

  const style = (el as HTMLElement).style;
  if (style.colorScheme === "dark") return true;

  return false;
}

// ── localStorage patterns ───────────────────────────────────────────────────

/**
 * Known localStorage keys that CMS/theme plugins use for dark mode.
 * Scanned defensively — no single key is assumed to exist.
 */
const LOCALSTORAGE_DARK_INDICATORS: { key: string; darkValues: string[] }[] = [
  // Moodle themes
  { key: "theme-dark-mode", darkValues: ["true", "1", "dark"] },
  { key: "darkmode", darkValues: ["true", "1", "dark", "enabled"] },
  { key: "dark-mode", darkValues: ["true", "1", "dark"] },
  { key: "moodle-theme-mode", darkValues: ["dark"] },
  { key: "boost-dark-mode", darkValues: ["true", "1"] },
  { key: "moove-dark-mode", darkValues: ["true", "1"] },
  // WordPress
  { key: "wp-dark-mode", darkValues: ["true", "1", "dark"] },
  { key: "flavor", darkValues: ["dark"] },
  // Generic
  { key: "theme", darkValues: ["dark"] },
  { key: "color-scheme", darkValues: ["dark"] },
  { key: "color-mode", darkValues: ["dark"] },
];

function localStorageIndicatesDark(): boolean | null {
  try {
    for (const { key, darkValues } of LOCALSTORAGE_DARK_INDICATORS) {
      const stored = localStorage.getItem(key);
      if (stored !== null && darkValues.includes(stored.toLowerCase())) {
        return true;
      }
    }
  } catch {
    // localStorage not available
  }
  return null;
}

// ── OS media query ──────────────────────────────────────────────────────────

function osPrefersColorScheme(): DetectedTheme {
  if (typeof window === "undefined") return "auto";
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
  return "auto";
}

// ── Main detector ───────────────────────────────────────────────────────────

/**
 * Detect the host page's theme. Read-only — never modifies host DOM.
 *
 * Returns 'dark', 'light', or 'auto' (couldn't determine).
 */
export function detectHostTheme(): DetectedTheme {
  if (typeof document === "undefined") return "auto";

  // 1. Check <html> and <body> for class/attribute indicators
  if (elementHasDarkIndicator(document.documentElement) || elementHasDarkIndicator(document.body)) {
    return "dark";
  }

  // Check for explicit light indicators
  if (
    document.documentElement.getAttribute("data-theme") === "light" ||
    document.documentElement.getAttribute("data-bs-theme") === "light" ||
    document.body.getAttribute("data-theme") === "light"
  ) {
    return "light";
  }

  // 2. Check localStorage patterns
  const lsResult = localStorageIndicatesDark();
  if (lsResult === true) return "dark";

  // 3. Fall back to OS preference
  return osPrefersColorScheme();
}

// ── Attributes to observe for MutationObserver ──────────────────────────────

export const OBSERVED_ATTRIBUTES = [
  "class",
  "data-theme",
  "data-bs-theme",
  "data-color-scheme",
  "data-color-mode",
  "data-moodle-theme-mode",
  "data-wp-dark",
  "style",
];

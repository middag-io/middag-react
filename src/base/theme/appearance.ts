/**
 * appearance — dark mode system with host detection + manual override.
 *
 * Three-tier resolution:
 *   1. Manual override (user clicked toggle) → 'light' or 'dark'
 *   2. 'system' → detectHostTheme() (Moodle/WP classes, attrs, localStorage)
 *   3. 'system' + no host signal → OS prefers-color-scheme
 *
 * Applies theme via:
 *   - `data-theme="dark|light"` on all `.middag-root` elements
 *   - `class="dark"` on `<html>` (for Tailwind dark: prefix compatibility)
 *
 * Never modifies host page's own classes/attributes (except <html>.dark which
 * is MIDDAG's own — the host doesn't use Tailwind dark: prefix).
 *
 * @see host-theme-detector.ts — read-only host detection
 * @see useHostTheme.ts — React hook with live observation
 */

import { detectHostTheme, type DetectedTheme } from "@/base/theme/host-theme-detector";
import { getStorageItem, setStorageItem } from "@/base/utils/storage";

export type Appearance = "system" | "light" | "dark";

export type EffectiveTheme = "light" | "dark";

/**
 * Resolve the effective theme from a preference.
 * 'system' consults host page first, then OS.
 */
export function getEffectiveTheme(preference: Appearance): EffectiveTheme {
  if (preference !== "system") return preference;

  const hostTheme: DetectedTheme = detectHostTheme();
  if (hostTheme === "dark") return "dark";
  if (hostTheme === "light") return "light";

  // Host returned 'auto' — fall back to OS
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Read stored preference from localStorage.
 */
export function getStoredAppearance(): Appearance {
  const stored = getStorageItem("appearance");
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system";
}

/**
 * Apply resolved theme to DOM.
 * Sets data-theme on all .middag-root elements + class dark on <html> for Tailwind.
 *
 * Also syncs `color-scheme` on <html> so native form controls (text inputs,
 * textareas, native selects, date/number pickers, autofill, scrollbars) render
 * in the matching UA scheme. Without this, switching to dark leaves native
 * widgets in the OS/UA light scheme — light foreground text on a light native
 * background reads as invisible inside forms.
 */
export function applyTheme(theme: EffectiveTheme): void {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;

  const roots = document.querySelectorAll(".middag-root");
  roots.forEach((el) => {
    el.setAttribute("data-theme", theme);
  });
}

/**
 * Apply appearance: persist preference, toggle dark class, set data-theme on MIDDAG roots.
 */
export function setAppearance(preference: Appearance): void {
  setStorageItem("appearance", preference);
  const theme = getEffectiveTheme(preference);
  applyTheme(theme);
}

/**
 * Cycle through modes: System → Light → Dark → System.
 */
export function cycleAppearance(): Appearance {
  const current = getStoredAppearance();
  const next: Appearance = current === "system" ? "light" : current === "light" ? "dark" : "system";
  setAppearance(next);
  return next;
}

/**
 * Toggle document direction between LTR and RTL.
 * Persists choice in localStorage.
 */
export function toggleDir(): "ltr" | "rtl" {
  const root = document.documentElement;
  const current = root.dir || "ltr";
  const next = current === "ltr" ? "rtl" : "ltr";
  root.dir = next;
  setStorageItem("dir", next);
  return next;
}

/**
 * Restore persisted direction on load.
 */
export function initDir(): void {
  const stored = getStorageItem("dir");
  if (stored === "rtl") {
    document.documentElement.dir = "rtl";
  }
}

/**
 * Listen for OS theme changes.
 * Only reacts when preference is 'system'.
 * Returns a cleanup function.
 */
export function onSystemThemeChange(callback?: () => void): () => void {
  const mql = window.matchMedia("(prefers-color-scheme: dark)");

  const handler = (): void => {
    if (getStoredAppearance() === "system") {
      const theme = getEffectiveTheme("system");
      applyTheme(theme);
      callback?.();
    }
  };

  mql.addEventListener("change", handler);
  return () => mql.removeEventListener("change", handler);
}

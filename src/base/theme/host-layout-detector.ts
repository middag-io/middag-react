/**
 * Host layout detector -- measures the host platform's header height
 * and sets --host-header-height on :root.
 *
 * The sidebar primitive reads var(--host-header-height, 0px) for
 * top offset and height. Without this, the sidebar starts at viewport top.
 *
 * Detection is read-only -- never modifies the host's DOM.
 * Re-measures on window resize and DOM mutations (admin notices, etc.).
 *
 * Known host headers:
 *   - Moodle Boost: nav.navbar, [data-region="navbar"]
 *   - WordPress:    #wpadminbar
 *   - Generic:      [data-host-header], header:first-child
 */

const HOST_HEADER_SELECTORS = [
  // WordPress admin bar
  "#wpadminbar",
  // Moodle Boost navbar
  "nav.navbar",
  '[data-region="navbar"]',
  // Explicit opt-in from any host
  "[data-host-header]",
] as const;

let _observer: MutationObserver | null = null;
let _resizeHandler: (() => void) | null = null;

/**
 * Measure the host header height by finding the first matching element.
 * Returns the offsetHeight or 0 if no host header is found.
 */
function measureHostHeaderHeight(): number {
  if (typeof document === "undefined") return 0;

  for (const selector of HOST_HEADER_SELECTORS) {
    const el = document.querySelector<HTMLElement>(selector);
    if (el) {
      // getBoundingClientRect is more accurate for fixed/sticky elements
      const rect = el.getBoundingClientRect();
      return Math.round(rect.height);
    }
  }

  return 0;
}

/**
 * Apply --host-header-height to :root.
 * Only writes if the value changed (avoids layout thrashing).
 */
function applyHostHeaderHeight(): void {
  const height = measureHostHeaderHeight();
  const current = document.documentElement.style.getPropertyValue("--host-header-height");
  const next = `${height}px`;

  if (current !== next) {
    document.documentElement.style.setProperty("--host-header-height", next);
  }
}

/**
 * Initialize host header height detection.
 *
 * Call once from your production entry point (or from ProductShell mount).
 * Sets --host-header-height immediately, then observes resize + DOM mutations.
 *
 * Safe to call in dev/mock (returns 0 if no host header is found).
 * Idempotent (calling multiple times does not stack observers).
 */
export function initHostHeaderHeight(): void {
  if (typeof document === "undefined") return;

  // Initial measurement
  applyHostHeaderHeight();

  // Observe resize (responsive breakpoints change header height)
  if (!_resizeHandler) {
    _resizeHandler = () => applyHostHeaderHeight();
    window.addEventListener("resize", _resizeHandler, { passive: true });
  }

  // Observe DOM mutations on <body> (admin notices, dynamic banners)
  if (!_observer) {
    _observer = new MutationObserver(() => {
      // Debounce with requestAnimationFrame
      requestAnimationFrame(() => applyHostHeaderHeight());
    });
    _observer.observe(document.body, {
      childList: true,
      subtree: false,
      attributes: false,
    });
  }
}

/**
 * Set --host-header-height to a fixed value (for mock/dev).
 * Bypasses auto-detection. Call initHostHeaderHeight() to resume auto mode.
 */
export function setHostHeaderHeight(px: number): void {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty("--host-header-height", `${px}px`);
}

/**
 * Clean up observers (for testing or unmount).
 */
export function destroyHostHeaderHeight(): void {
  if (_resizeHandler) {
    window.removeEventListener("resize", _resizeHandler);
    _resizeHandler = null;
  }
  if (_observer) {
    _observer.disconnect();
    _observer = null;
  }
}

/**
 * Portal container for CSS isolation (ADR-807).
 *
 * Radix UI portals default to document.body, which is outside .middag-root.
 * This utility returns the #middag-portals container (created in inertia-app.tsx)
 * so portal content inherits our scoped Tailwind styles.
 */

let cached: HTMLElement | null = null;

export function getPortalContainer(): HTMLElement {
  if (!cached) {
    cached = document.getElementById("middag-portals") ?? document.body;
  }
  return cached;
}

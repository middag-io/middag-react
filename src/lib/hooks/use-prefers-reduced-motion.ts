import { useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** The media query list, or null where matchMedia is unavailable (SSR, old jsdom). */
function mediaQuery(): MediaQueryList | null {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return null;
  return window.matchMedia(REDUCED_MOTION_QUERY);
}

function subscribe(callback: () => void): () => void {
  const mql = mediaQuery();
  if (!mql) return () => {};
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot(): boolean {
  return mediaQuery()?.matches ?? false;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * True when the user asked the OS to reduce motion. CSS covers transitions and
 * keyframe animations; JS-driven animation (canvas, Lottie) must check this.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

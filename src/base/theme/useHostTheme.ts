/**
 * useHostTheme — React hook that detects and tracks the host page's dark/light theme.
 *
 * Observes:
 *   - Class/attribute mutations on <html> and <body> (MutationObserver)
 *   - OS prefers-color-scheme changes (matchMedia)
 *   - localStorage changes from other tabs (storage event)
 *
 * Never modifies the host's DOM or localStorage.
 * Applies theme to the MIDDAG root container via data-theme attribute.
 *
 * @param override Manual override: 'auto' (detect from host), 'dark', or 'light'.
 */

import { useCallback, useEffect, useState } from "react";

import {
  detectHostTheme,
  OBSERVED_ATTRIBUTES,
  type DetectedTheme,
} from "@/base/theme/host-theme-detector";

export type ThemeOverride = "auto" | "dark" | "light";

export interface UseHostThemeResult {
  /** Resolved theme: always 'dark' or 'light' (never 'auto'). */
  theme: "dark" | "light";
  /** Raw detected value from host before override. */
  detected: DetectedTheme;
  /** Current override setting. */
  override: ThemeOverride;
  /** Change override at runtime. */
  setOverride: (override: ThemeOverride) => void;
}

function resolveTheme(detected: DetectedTheme, override: ThemeOverride): "dark" | "light" {
  if (override !== "auto") return override;
  if (detected === "dark") return "dark";
  return "light";
}

export function useHostTheme(initialOverride: ThemeOverride = "auto"): UseHostThemeResult {
  const [override, setOverride] = useState<ThemeOverride>(initialOverride);
  const [detected, setDetected] = useState<DetectedTheme>(() => detectHostTheme());

  const redetect = useCallback(() => {
    setDetected(detectHostTheme());
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;

    // ── MutationObserver on <html> and <body> ───────────────────
    const observer = new MutationObserver(redetect);
    const config: MutationObserverInit = {
      attributes: true,
      attributeFilter: OBSERVED_ATTRIBUTES,
    };

    observer.observe(document.documentElement, config);
    if (document.body) {
      observer.observe(document.body, config);
    }

    // ── prefers-color-scheme listener ────────────────────────────
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const mediaHandler = () => redetect();
    mql.addEventListener("change", mediaHandler);

    // ── storage event (other tabs changing localStorage) ────────
    const storageHandler = (e: StorageEvent) => {
      if (
        e.key === null || // clear()
        e.key.includes("dark") ||
        e.key.includes("theme") ||
        e.key.includes("mode") ||
        e.key.includes("color") ||
        e.key.includes("appearance")
      ) {
        redetect();
      }
    };
    window.addEventListener("storage", storageHandler);

    return () => {
      observer.disconnect();
      mql.removeEventListener("change", mediaHandler);
      window.removeEventListener("storage", storageHandler);
    };
  }, [redetect]);

  const theme = resolveTheme(detected, override);

  return { theme, detected, override, setOverride };
}

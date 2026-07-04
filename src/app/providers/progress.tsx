/**
 * ProgressProvider — NProgress integration for Inertia SPA navigation.
 *
 * Hooks into Inertia router events to show a thin progress bar at the
 * top of the viewport during page transitions.
 *
 * @see NV-05-ux-shell-sidebar.md §6.3
 */

import { useEffect, type ReactNode } from "react";
import { router } from "@inertiajs/core";
import NProgress from "nprogress";

// Configure NProgress — disable spinner (we use Lucide), set minimum
NProgress.configure({
  showSpinner: false,
  minimum: 0.08,
  speed: 200,
  trickleSpeed: 200,
});

export function ProgressProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Start on navigation begin
    const startProgress = router.on("start", () => {
      NProgress.start();
    });

    // Complete on finish
    const finishProgress = router.on("finish", (event) => {
      if (event.detail.visit.completed) {
        NProgress.done();
      } else if (event.detail.visit.interrupted) {
        NProgress.set(0);
      } else {
        // Visit was cancelled or failed
        NProgress.done();
        // Briefly flash bar in destructive color on error
        const bar = document.querySelector("#nprogress .bar") as HTMLElement | null;
        if (bar) {
          bar.style.background = "var(--destructive)";
          setTimeout(() => {
            bar.style.background = "";
          }, 600);
        }
      }
    });

    return () => {
      startProgress();
      finishProgress();
    };
  }, []);

  return <>{children}</>;
}

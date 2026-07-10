/**
 * ImmersiveShell — full-screen shell with minimal chrome.
 *
 * No sidebar, no persistent navigation. Only a slim top bar with
 * a back/close button and optional title. Designed for focused
 * experiences: wizards, flow editors, onboarding, presentations.
 *
 * The host can provide a `backHref` in the page contract to control
 * where the close button navigates (defaults to browser history back).
 */

import { useCallback, type ReactElement } from "react";
import { router, usePage } from "@inertiajs/react";

import type { PageMeta } from "@/contracts/page-contract";
import type { SharedProps } from "@/contracts/shared-props";
import type { ShellProps } from "@/engine/registries";
import { renderLabel } from "@/i18n/render-label";
import { useTranslation } from "@/i18n/useTranslation";
import { Toaster } from "@/primitives/reui/sonner";

export function ImmersiveShell({ children }: ShellProps): ReactElement {
  const { t } = useTranslation();
  const { props } = usePage<SharedProps>();

  const page: PageMeta = (props as SharedProps & { contract?: { page?: PageMeta } }).contract
    ?.page ?? {
    key: "unknown",
    title: "",
    breadcrumbs: [],
    actions: [],
  };

  const backHref = page.breadcrumbs?.[page.breadcrumbs.length - 1]?.href;

  const handleClose = useCallback(() => {
    if (backHref) {
      router.visit(backHref);
    } else {
      window.history.back();
    }
  }, [backHref]);

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      {/* Slim top bar */}
      <header className="border-border flex h-12 shrink-0 items-center gap-3 border-b px-4">
        <button
          type="button"
          onClick={handleClose}
          className="text-muted-foreground hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md transition-colors"
          aria-label={t("middag.ui.close")}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="h-5 w-5"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {page.title && (
          <span className="text-foreground truncate text-sm font-medium">
            {renderLabel(page.title, t)}
          </span>
        )}
      </header>

      {/* Full-bleed content */}
      <main
        id="middag-main-content"
        className="flex min-h-0 flex-1 flex-col"
        aria-live="polite"
        aria-busy="false"
      >
        {children}
      </main>

      <Toaster position="bottom-right" richColors />
    </div>
  );
}

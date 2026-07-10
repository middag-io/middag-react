/**
 * PageActionButton — handles navigation, API calls, loading, and confirmation.
 *
 * Replaces inline ActionButton in PageHeader with full v2 support:
 * - GET → Link navigation (existing)
 * - POST/PUT/PATCH/DELETE → Inertia in-place with preserveState
 * - confirmation → ConfirmationDialog before executing
 * - loading state while request in-flight
 *
 * Navigation/request is resolved through `resolveActionTarget` (Phase-0 adapter seam)
 * so the later flip from flat `href`/`method` to the canonical `target` is a no-op
 * here; labels render through `renderLabel` for the same reason.
 *
 * @see Page Builder v2 spec §Gap 6
 */

import { useCallback, useState, type ReactElement } from "react";
import { router } from "@inertiajs/core";
import { Link } from "@inertiajs/react";

import { ConfirmationDialog } from "@/base/partials/ConfirmationDialog";
import type { PageAction } from "@/contracts/page-contract";
import { renderLabel } from "@/i18n/render-label";
import { useTranslation } from "@/i18n/useTranslation";
import { resolveActionTarget } from "@/lib/actions/resolve-action-target";
import { Button } from "@/primitives/reui/button";

type ButtonVariant = "default" | "outline" | "destructive" | "ghost" | "secondary" | "link";

const VARIANT_MAP: Record<string, ButtonVariant> = {
  primary: "default",
  secondary: "outline",
  danger: "destructive",
  ghost: "ghost",
};

export function PageActionButton({ action }: { action: PageAction }): ReactElement {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const target = resolveActionTarget(action);
  const variant: ButtonVariant = VARIANT_MAP[action.intent] ?? "outline";
  const isNavigation = target.kind === "link";
  // External loading (server-driven via action.loading) merges with local in-flight state
  const effectiveLoading = isLoading || action.loading === true;

  const executeAction = useCallback(() => {
    if (!target.url) return;

    if (isNavigation) {
      router.visit(target.url);
      return;
    }

    setIsLoading(true);

    const options = {
      preserveState: true,
      preserveScroll: true,
      onFinish: () => {
        if (!action.confirmation?.waitForPolling) {
          setIsLoading(false);
        }
      },
    };
    if (target.method === "delete") {
      // router.delete signature is (url, options) — no data arg.
      router.delete(target.url, options);
    } else {
      const method = target.method as "post" | "put" | "patch";
      router[method](target.url, {} as never, options);
    }

    if (action.confirmation?.waitForPolling) {
      setIsWaiting(true);
    }
  }, [action, target, isNavigation]);

  const confirmation = action.confirmation;

  const handleClick = useCallback(() => {
    if (confirmation) {
      setShowConfirm(true);
    } else {
      executeAction();
    }
  }, [confirmation, executeAction]);

  const handleConfirm = useCallback(() => {
    // Execute FIRST, then close — avoids onOpenChange race condition
    executeAction();
    if (!action.confirmation?.waitForPolling) {
      setShowConfirm(false);
    }
  }, [action, executeAction]);

  const handleCloseConfirm = useCallback(() => {
    setShowConfirm(false);
    setIsWaiting(false);
    // Only reset loading if no request is in-flight
    if (!isLoading) {
      setIsLoading(false);
    }
  }, [isLoading]);

  const label = renderLabel(action.label, t);

  // Simple navigation link (GET, no confirmation)
  if (isNavigation && target.url && !confirmation && !action.loading) {
    return (
      <Button
        variant={variant}
        size="sm"
        asChild
        disabled={action.disabled}
        aria-disabled={action.disabled}
      >
        <Link href={target.url}>{label}</Link>
      </Button>
    );
  }

  return (
    <>
      <Button
        variant={variant}
        size="sm"
        onClick={handleClick}
        disabled={action.disabled || effectiveLoading}
        aria-disabled={action.disabled || effectiveLoading}
      >
        {effectiveLoading && (
          <svg
            className="mr-2 size-3.5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {label}
      </Button>

      {confirmation && (
        <ConfirmationDialog
          open={showConfirm}
          onClose={handleCloseConfirm}
          onConfirm={handleConfirm}
          title={renderLabel(confirmation.title, t)}
          message={renderLabel(confirmation.message, t)}
          intent={confirmation.intent}
          confirmLabel={
            confirmation.confirmLabel ? renderLabel(confirmation.confirmLabel, t) : undefined
          }
          cancelLabel={
            confirmation.cancelLabel ? renderLabel(confirmation.cancelLabel, t) : undefined
          }
          waiting={isWaiting}
          waitingMessage={
            confirmation.waitingMessage ? renderLabel(confirmation.waitingMessage, t) : undefined
          }
        />
      )}
    </>
  );
}

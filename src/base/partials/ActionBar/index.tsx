/**
 * ActionBar — bulk action toolbar for selected rows.
 *
 * Shows selected count + bulk action buttons. Dangerous actions require confirmation
 * via the unified ConfirmationDialog.
 *
 * @see NV-05-ux-blocks.md §1.2 toolbar anatomy
 */

import { useState, type ReactElement } from "react";

import { ConfirmationDialog } from "@/base/partials/ConfirmationDialog";
import { Button } from "@/components/reui/button";
import type { ExecutableAction } from "@/contracts/block-data";
import { renderLabel } from "@/i18n/render-label";
import { useTranslation } from "@/i18n/useTranslation";

export interface ActionBarProps {
  selectedCount: number;
  totalCount: number;
  actions: ExecutableAction[];
  onAction: (actionId: string) => void;
  onSelectAll?: () => void;
  isLoading?: boolean;
}

export function ActionBar({
  selectedCount,
  totalCount,
  actions,
  onAction,
  onSelectAll,
  isLoading,
}: ActionBarProps): ReactElement {
  const { t } = useTranslation();
  const [confirmAction, setConfirmAction] = useState<ExecutableAction | null>(null);

  const handleAction = (action: ExecutableAction) => {
    if (action.confirmation) {
      setConfirmAction(action);
    } else {
      onAction(action.id);
    }
  };

  const bulkMessage = confirmAction
    ? renderLabel(confirmAction.confirmation?.message, t) ||
      t("middag.ui.actionbar.confirm_bulk", {
        label: renderLabel(confirmAction.label, t),
        total: selectedCount,
        items: t("middag.ui.actionbar.item", { count: selectedCount }),
      })
    : "";

  return (
    <>
      <div
        className="flex items-center gap-3"
        role="toolbar"
        aria-label={t("middag.ui.actionbar.label")}
      >
        <span className="text-sm font-semibold" role="status" aria-live="polite">
          {t("middag.ui.actionbar.selected", { count: selectedCount })}
        </span>

        {totalCount > selectedCount && onSelectAll && (
          <button onClick={onSelectAll} className="text-primary text-xs hover:underline">
            {t("middag.ui.actionbar.select_all", { total: totalCount })}
          </button>
        )}

        {actions.map((action) => (
          <Button
            key={action.id}
            variant={action.intent === "danger" ? "destructive" : "outline"}
            size="sm"
            onClick={() => handleAction(action)}
            disabled={isLoading}
          >
            {renderLabel(action.label, t)}
          </Button>
        ))}
      </div>

      {confirmAction && (
        <ConfirmationDialog
          open={!!confirmAction}
          onClose={() => setConfirmAction(null)}
          onConfirm={() => {
            onAction(confirmAction.id);
            setConfirmAction(null);
          }}
          title={renderLabel(confirmAction.confirmation?.title ?? confirmAction.label, t)}
          message={bulkMessage}
          intent={
            confirmAction.confirmation?.intent ??
            (confirmAction.intent === "danger" ? "danger" : undefined)
          }
          confirmLabel={
            confirmAction.confirmation?.confirmLabel
              ? renderLabel(confirmAction.confirmation.confirmLabel, t)
              : undefined
          }
          cancelLabel={
            confirmAction.confirmation?.cancelLabel
              ? renderLabel(confirmAction.confirmation.cancelLabel, t)
              : undefined
          }
        />
      )}
    </>
  );
}

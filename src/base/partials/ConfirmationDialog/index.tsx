/**
 * ConfirmationDialog — generic confirmation modal for actions.
 *
 * Supports two patterns:
 * 1. Confirm & Execute: simple confirmation, closes after confirm click.
 * 2. Confirm & Wait: stays open with spinner until polling resolves.
 *
 * Used by DenseTableBlock (row actions) and PageHeader (page actions).
 *
 * @see Page Builder v2 spec §Confirmation Dialogs
 */

import { type ReactElement } from "react";

import { Button } from "@/components/reui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/reui/dialog";
import { useTranslation } from "@/i18n/useTranslation";

function Spinner({ className }: { className?: string }): ReactElement {
  return (
    <svg
      className={`animate-spin ${className ?? ""}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  intent?: "danger" | "warning" | "default";
  confirmLabel?: string;
  cancelLabel?: string;
  waiting?: boolean;
  waitingMessage?: string;
}

export function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  intent = "default",
  confirmLabel,
  cancelLabel,
  waiting = false,
  waitingMessage,
}: ConfirmationDialogProps): ReactElement {
  const { t } = useTranslation();
  const confirmVariant = intent === "danger" ? "destructive" : "default";

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && !waiting) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            <span dangerouslySetInnerHTML={{ __html: message }} />
          </DialogDescription>
        </DialogHeader>

        {waiting && waitingMessage && (
          <div className="text-muted-foreground flex items-center gap-2 py-2">
            <Spinner className="size-4" />
            <span className="text-sm">{waitingMessage}</span>
          </div>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={waiting}>
            {cancelLabel ?? t("middag.ui.cancel")}
          </Button>
          <Button type="button" variant={confirmVariant} onClick={onConfirm} disabled={waiting}>
            {waiting && <Spinner className="mr-2 size-4" />}
            {confirmLabel ?? t("middag.ui.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

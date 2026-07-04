"use client";

import { useCallback, useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

import { useTranslation } from "@/i18n/useTranslation";

interface OverlayScreenProps {
  children: ReactNode;
  onClose?: () => void;
}

/**
 * Full-screen overlay panel with X close button (NV-05 — ADR-807).
 *
 * Not a modal (no backdrop, no centering). Renders a stacked screen
 * on top of the current page. The underlying page stays mounted in the DOM.
 *
 * Close behavior: calls onClose if provided, otherwise window.history.back().
 * Also closes on Escape key.
 */
export function OverlayScreen({ children, onClose }: OverlayScreenProps) {
  const { t } = useTranslation();
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      window.history.back();
    }
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handler);

    return () => document.removeEventListener("keydown", handler);
  }, [handleClose]);

  // Trap focus inside overlay.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;

    return () => {
      previouslyFocused?.focus();
    };
  }, []);

  return (
    <div className="bg-background fixed inset-0 z-50 overflow-auto">
      <button
        onClick={handleClose}
        className="hover:bg-muted fixed top-4 right-4 z-[51] rounded-md p-2 transition-colors"
        aria-label={t("middag.ui.overlay.close")}
        type="button"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="min-h-screen p-6">{children}</div>
    </div>
  );
}

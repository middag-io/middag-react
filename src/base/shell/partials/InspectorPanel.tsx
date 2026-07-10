"use client";

import type { ReactNode } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/primitives/reui/sheet";

interface InspectorPanelProps {
  /** Whether the panel is open. */
  open: boolean;
  /** Called when the panel should close (overlay click or X button). */
  onClose: () => void;
  /** Panel width in pixels (from inspector descriptor, default 440). */
  width?: number;
  /** Panel title. */
  title?: string;
  /** Optional description below the title. */
  description?: string;
  /** Panel body content (tabs, detail sections, etc.). */
  children: ReactNode;
}

/**
 * InspectorPanel — drawer-style side panel for inspecting selected items.
 *
 * Wraps the ReUI Sheet (Radix Dialog) with:
 * - Lighter overlay (bg-black/20 instead of bg-black/50)
 * - Configurable width (default 440px from inspector_descriptor)
 * - Jira-style 220ms cubic-bezier animation
 *
 * @see inspector_descriptor (PHP) for backend configuration
 * @see HelpPanel for the similar contextual-help slide-out
 */
export function InspectorPanel({
  open,
  onClose,
  width = 440,
  title,
  description,
  children,
}: InspectorPanelProps) {
  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent
        side="right"
        className="inspector-panel flex flex-col"
        style={{ "--inspector-width": `${width}px` } as React.CSSProperties}
        showCloseButton
      >
        {title && (
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </SheetContent>
    </Sheet>
  );
}

/**
 * QuickRecordSheet — slide-over panel for quick record create/edit.
 *
 * Community partial built on the ReUI Sheet (Radix Dialog) primitive. Controlled
 * via `open`/`onOpenChange`; the caller supplies the form body (children) and the
 * action footer. Holds no data and fetches nothing.
 */

import { type ReactElement, type ReactNode } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/primitives/reui/sheet";

export interface QuickRecordSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** Form body. */
  children: ReactNode;
  /** Action footer (e.g. save / cancel buttons). */
  footer?: ReactNode;
  /** Which edge the sheet slides in from. Default "right". */
  side?: "top" | "right" | "bottom" | "left";
  /** Optional trigger element rendered inline (uses asChild). */
  trigger?: ReactNode;
}

export function QuickRecordSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  side = "right",
  trigger,
}: QuickRecordSheetProps): ReactElement {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent side={side} className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-4">{children}</div>
        {footer && <SheetFooter>{footer}</SheetFooter>}
      </SheetContent>
    </Sheet>
  );
}

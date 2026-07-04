/**
 * ResizableSidebar — a content area with a user-resizable aside panel.
 *
 * Community shell primitive built on the ReUI Resizable (react-resizable-panels)
 * primitive. Holds no data and fetches nothing — the caller supplies both the
 * main content and the aside content.
 *
 * The richer data-driven InlineInspector composition lives in @middag-io/react-pro.
 */

import { type ReactElement, type ReactNode } from "react";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/reui/resizable";
import { cn } from "@/lib/utils";

export interface ResizableSidebarProps {
  /** Primary content. */
  children: ReactNode;
  /** Aside (secondary) content. */
  aside: ReactNode;
  /** Which side the aside sits on. Default "right". */
  asideSide?: "left" | "right";
  /** Initial aside width as a percentage of the group. Default 30. */
  defaultAsideSize?: number;
  /** Minimum aside width percentage. Default 15. */
  minAsideSize?: number;
  /** Maximum aside width percentage. Default 50. */
  maxAsideSize?: number;
  className?: string;
}

export function ResizableSidebar({
  children,
  aside,
  asideSide = "right",
  defaultAsideSize = 30,
  minAsideSize = 15,
  maxAsideSize = 50,
  className,
}: ResizableSidebarProps): ReactElement {
  const mainPanel = (
    <ResizablePanel defaultSize={100 - defaultAsideSize} minSize={100 - maxAsideSize}>
      {children}
    </ResizablePanel>
  );

  const asidePanel = (
    <ResizablePanel defaultSize={defaultAsideSize} minSize={minAsideSize} maxSize={maxAsideSize}>
      {aside}
    </ResizablePanel>
  );

  return (
    <ResizablePanelGroup orientation="horizontal" className={cn("h-full", className)}>
      {asideSide === "left" ? (
        <>
          {asidePanel}
          <ResizableHandle withHandle />
          {mainPanel}
        </>
      ) : (
        <>
          {mainPanel}
          <ResizableHandle withHandle />
          {asidePanel}
        </>
      )}
    </ResizablePanelGroup>
  );
}

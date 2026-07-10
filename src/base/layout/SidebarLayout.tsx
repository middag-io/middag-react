/**
 * SidebarLayout — renders the `sidebar` template from page-contract.
 *
 * Two-column layout with main content area and aside panel (320px).
 * Regions: main (required), aside (required), header? (optional).
 *
 * When the header region is present, it renders as a full-width row
 * above the two columns.
 *
 * The aside panel has a left border and subtle background, styled
 * via semantic tokens so themes can override it.
 */
import type { ReactElement } from "react";

import type { LayoutProps } from "@/engine/registries";

import { BlockRegion } from "./BlockRegion";

export function SidebarLayout({ layout, renderBlock }: LayoutProps): ReactElement {
  const { regions } = layout;
  const headerBlocks = regions.header ?? [];
  const mainBlocks = regions.main ?? [];
  const asideBlocks = regions.aside ?? [];

  return (
    <div className="flex flex-col gap-5 py-6">
      {headerBlocks.length > 0 && <BlockRegion blocks={headerBlocks} renderBlock={renderBlock} />}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
        <BlockRegion blocks={mainBlocks} renderBlock={renderBlock} className="min-w-0" />
        {asideBlocks.length > 0 && (
          <aside className="border-border bg-muted/30 border-l">
            <BlockRegion blocks={asideBlocks} renderBlock={renderBlock} className="py-4" />
          </aside>
        )}
      </div>
    </div>
  );
}

/**
 * StackLayout — renders the `stack` template from page-contract.
 *
 * Regions: content (required), header? (optional), footer? (optional).
 * Single column, blocks stacked vertically.
 *
 * Uses BlockRegion for per-block horizontal padding with fullBleed support.
 */
import type { ReactElement } from "react";

import type { LayoutProps } from "@/app/registries";

import { BlockRegion } from "./BlockRegion";

export function StackLayout({ layout, renderBlock }: LayoutProps): ReactElement {
  const { regions } = layout;
  const headerBlocks = regions.header ?? [];
  const contentBlocks = regions.content ?? [];
  const footerBlocks = regions.footer ?? [];

  return (
    <div className="flex flex-col gap-5 py-6">
      {headerBlocks.length > 0 && <BlockRegion blocks={headerBlocks} renderBlock={renderBlock} />}
      <BlockRegion blocks={contentBlocks} renderBlock={renderBlock} />
      {footerBlocks.length > 0 && (
        <div className="border-border border-t pt-5">
          <BlockRegion blocks={footerBlocks} renderBlock={renderBlock} />
        </div>
      )}
    </div>
  );
}

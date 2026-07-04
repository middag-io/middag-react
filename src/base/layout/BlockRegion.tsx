/**
 * BlockRegion — shared utility for rendering a list of blocks
 * with consistent per-block horizontal padding.
 *
 * Skips padding for blocks with `meta.fullBleed: true` (edge-to-edge).
 * Used by all built-in layouts as a composition primitive.
 * Custom layouts can use BlockRegion directly or handle padding manually.
 */

import type { ReactElement } from "react";

import type { BlockDescriptor } from "@/contracts/page-contract";
import { cn } from "@/lib/utils";

interface BlockRegionProps {
  blocks: BlockDescriptor[];
  renderBlock: (block: BlockDescriptor) => ReactElement | null;
  className?: string;
}

export function BlockRegion({ blocks, renderBlock, className }: BlockRegionProps): ReactElement {
  return (
    <div className={cn("space-y-4", className)}>
      {blocks.map((block) => {
        const fullBleed = (block.meta as Record<string, unknown> | undefined)?.fullBleed === true;
        return (
          <div key={block.key} className={cn(!fullBleed && "px-6")}>
            {renderBlock(block)}
          </div>
        );
      })}
    </div>
  );
}

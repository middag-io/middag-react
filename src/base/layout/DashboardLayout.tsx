/**
 * DashboardLayout — renders the `dashboard` template from page-contract.
 *
 * Regions: metrics (full-width grid row), header?, content, aside? (optional).
 *
 * Metrics renders blocks in a grid (no per-block padding).
 * Content and aside render blocks directly — blocks are self-describing.
 *
 * @see NV-05-ux-screens-core.md T-01
 */

import type { ReactElement } from "react";

import { StatRow } from "@/base/partials/StatRow";
import type { BlockDescriptor } from "@/contracts/page-contract";
import type { LayoutProps } from "@/engine/registries";
import { renderLabel } from "@/i18n/render-label";
import { useTranslation } from "@/i18n/useTranslation";
import { Card, CardContent, CardHeader, CardTitle } from "@/primitives/reui/card";

function BlockCard({
  block,
  renderBlock,
}: {
  block: BlockDescriptor;
  renderBlock: (b: BlockDescriptor) => ReactElement | null;
}): ReactElement {
  const { t } = useTranslation();
  return (
    <Card>
      {block.title && (
        <CardHeader>
          <CardTitle className="text-sm">{renderLabel(block.title, t)}</CardTitle>
        </CardHeader>
      )}
      <CardContent>{renderBlock(block)}</CardContent>
    </Card>
  );
}

/**
 * Content-to-aside ratio, by name.
 *
 * Both tracks are wrapped in `minmax(0, …)`. Without it a grid track refuses to
 * shrink below the intrinsic minimum of its content, so one wide child — a table
 * with many columns is the usual one — takes more than its share and pushes the
 * aside past the right edge of the window, with no horizontal scrollbar to reach
 * it. `minmax(0, …)` lets the content column shrink and scroll internally
 * instead, which keeps the aside on screen at every width.
 */
const ASIDE_RATIO = {
  default: "lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]",
  narrow: "lg:grid-cols-[minmax(0,4fr)_minmax(0,1fr)]",
  wide: "lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]",
} as const;

type AsideWidth = keyof typeof ASIDE_RATIO;

export function DashboardLayout({ layout, renderBlock }: LayoutProps): ReactElement {
  const { regions } = layout;
  const metricsBlocks = regions.metrics ?? [];
  const headerBlocks = regions.header ?? [];
  const contentBlocks = regions.content ?? [];
  const asideBlocks = regions.aside ?? [];
  const hasAside = asideBlocks.length > 0;

  // A page whose aside holds a short list of facets wants less room than one
  // holding a chart. The contract carries a name rather than a length so the
  // scale stays the layout's to decide, and an unknown value falls back instead
  // of producing a class Tailwind never generated.
  const asideWidth = (layout.meta as { asideWidth?: string } | undefined)?.asideWidth;
  const ratio = ASIDE_RATIO[asideWidth as AsideWidth] ?? ASIDE_RATIO.default;

  return (
    <div className="bg-muted/50 -mx-[var(--content-padding,0px)] mt-2 -mb-6 flex flex-col gap-6 px-[var(--content-padding,1.5rem)] py-6">
      {/* Header */}
      {headerBlocks.length > 0 && (
        <div className="space-y-4">
          {headerBlocks.map((block) => (
            <div key={block.key}>{renderBlock(block)}</div>
          ))}
        </div>
      )}

      {/* Unified grid — metrics inside content column, aside aligned from top */}
      <div className={hasAside ? `grid grid-cols-1 gap-6 ${ratio}` : "grid grid-cols-1 gap-6"}>
        <div className="space-y-6">
          {metricsBlocks.length > 0 && (
            <StatRow columns={metricsBlocks.length <= 3 ? 3 : 4}>
              {metricsBlocks.map(renderBlock)}
            </StatRow>
          )}
          {contentBlocks.map((block) => (
            <BlockCard key={block.key} block={block} renderBlock={renderBlock} />
          ))}
        </div>
        {hasAside && (
          <aside className="space-y-6">
            {asideBlocks.map((block) => (
              <BlockCard key={block.key} block={block} renderBlock={renderBlock} />
            ))}
          </aside>
        )}
      </div>
    </div>
  );
}

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

import type { LayoutProps } from "@/app/registries";
import { StatRow } from "@/base/partials/StatRow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/reui/card";
import type { BlockDescriptor } from "@/contracts/page-contract";
import { renderLabel } from "@/i18n/render-label";
import { useTranslation } from "@/i18n/useTranslation";

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

export function DashboardLayout({ layout, renderBlock }: LayoutProps): ReactElement {
  const { regions } = layout;
  const metricsBlocks = regions.metrics ?? [];
  const headerBlocks = regions.header ?? [];
  const contentBlocks = regions.content ?? [];
  const asideBlocks = regions.aside ?? [];
  const hasAside = asideBlocks.length > 0;

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
      <div
        className={
          hasAside ? "grid grid-cols-1 gap-6 lg:grid-cols-[3fr_1fr]" : "grid grid-cols-1 gap-6"
        }
      >
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

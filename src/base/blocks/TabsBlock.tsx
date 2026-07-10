/**
 * TabsBlock — composite block that organizes inner blocks into tabs.
 *
 * Each tab contains an array of BlockDescriptors rendered via the block registry.
 * Uses ReUI Tabs with line variant + MIDDAG-specific styling (2px primary underline,
 * active font-weight 500).
 *
 * @see DESIGN.md §P1 — Tabs
 * @see ADR-807 ref/page-contract-v1 §5
 */

import type { ReactElement } from "react";

import { NavErrorBoundary } from "@/base/shell/partials/NavErrorBoundary";
import type { TabsBlockData } from "@/contracts/block-data";
import type { BlockDescriptor } from "@/contracts/page-contract";
import { isLazyBlock, LazyBlock } from "@/engine/LazyBlock";
import { resolveBlock } from "@/engine/registries";
import type { BlockProps } from "@/engine/registries";
import { renderLabel } from "@/i18n/render-label";
import { useTranslation } from "@/i18n/useTranslation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/primitives/reui/tabs";

function UnknownBlock({ type }: { type: string }): ReactElement {
  const { t } = useTranslation();
  return (
    <div className="border-border text-muted-foreground rounded-md border border-dashed p-2 text-sm">
      {t("middag.ui.block.unknown_type")}{" "}
      <code className="bg-muted rounded-[3px] px-1.5 py-px font-mono text-xs">{type}</code>
    </div>
  );
}

function renderInnerBlock(block: BlockDescriptor): ReactElement | null {
  const Block = resolveBlock(block.type);

  if (!Block) {
    return <UnknownBlock key={block.key} type={block.type} />;
  }

  if (isLazyBlock(block)) {
    return (
      <NavErrorBoundary key={block.key}>
        <LazyBlock block={block} Component={Block} />
      </NavErrorBoundary>
    );
  }

  return (
    <NavErrorBoundary key={block.key}>
      <Block block={block} />
    </NavErrorBoundary>
  );
}

export function TabsBlock({ block }: BlockProps<TabsBlockData>): ReactElement {
  const { t } = useTranslation();
  const { tabs, defaultTab } = block.data;

  if (tabs.length === 0) {
    return <div />;
  }

  const initialTab = defaultTab ?? tabs[0].id;

  return (
    <Tabs defaultValue={initialTab} className="w-full">
      <TabsList variant="line" className="border-border w-full justify-start border-b">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="data-[state=active]:text-primary data-[state=active]:after:bg-primary px-4 py-3 text-sm data-[state=active]:font-medium"
          >
            {renderLabel(tab.label, t)}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-4 space-y-6">
          {/* tab.blocks is the generated wire BlockDescriptor (data: object | []);
              renderInnerBlock takes the composed page-contract BlockDescriptor
              (data: Record<string, unknown>). Same runtime JSON shape — the
              generated union's `[]` arm only exists for the empty-object wire
              case, which is not representable as Record<string, unknown> at
              the type level. */}
          {(tab.blocks as unknown as BlockDescriptor[]).map(renderInnerBlock)}
        </TabsContent>
      ))}
    </Tabs>
  );
}

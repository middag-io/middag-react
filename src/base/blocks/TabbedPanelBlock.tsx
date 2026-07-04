/**
 * TabbedPanelBlock — composite block that organizes inner blocks into tabs.
 *
 * Each tab contains an array of BlockDescriptors rendered via the block registry.
 * Uses ReUI Tabs with line variant + MIDDAG-specific styling (2px primary underline,
 * active font-weight 500).
 *
 * @see DESIGN.md §P1 — Tabs
 * @see ADR-807 ref/page-contract-v1 §5
 */

import type { ReactElement } from "react";

import { isLazyBlock, LazyBlock } from "@/app/LazyBlock";
import { resolveBlock } from "@/app/registries";
import type { BlockProps } from "@/app/registries";
import { NavErrorBoundary } from "@/base/shell/partials/NavErrorBoundary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/reui/tabs";
import type { TabbedPanelBlockData } from "@/contracts/block-data";
import type { BlockDescriptor } from "@/contracts/page-contract";
import { useTranslation } from "@/i18n/useTranslation";

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

export function TabbedPanelBlock({ block }: BlockProps<TabbedPanelBlockData>): ReactElement {
  const { data } = block;
  const { tabs, defaultTab } = data;

  if (tabs.length === 0) {
    return <div />;
  }

  const initialTab = defaultTab ?? tabs[0].key;

  return (
    <Tabs defaultValue={initialTab} className="w-full">
      <TabsList variant="line" className="border-border w-full justify-start border-b">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.key}
            value={tab.key}
            className="data-[state=active]:text-primary data-[state=active]:after:bg-primary px-4 py-3 text-sm data-[state=active]:font-medium"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.key} value={tab.key} className="mt-4 space-y-6">
          {tab.blocks.map(renderInnerBlock)}
        </TabsContent>
      ))}
    </Tabs>
  );
}

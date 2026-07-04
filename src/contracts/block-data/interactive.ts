/**
 * Interactive block types — blocks with user interaction beyond read-only display.
 *
 * Community tier: ActionGrid + TabbedPanel. The Pro interactive blocks
 * (SentenceBuilder, ConditionTree, FlowEditor, FormBuilder, KanbanBoard) ship as
 * generated types in @middag-io/react-pro (sourced from Middag\Core\Ui).
 */

import type { ActionBase } from "./actions";

// ── ActionGridBlock ─────────────────────────────────────────────────────────

/** A card in the action grid: the canonical Action plus card presentation. */
export interface ActionGridItem extends ActionBase {
  title: string;
  description: string;
}

export interface ActionGridBlockData {
  items: ActionGridItem[];
  flash?: { success: boolean; message: string } | null;
}

// ── TabbedPanelBlock ───────────────────────────────────────────────────────

/**
 * Block-level tab inside a tabbed_panel block. Distinct concern from the Community
 * wire `Tab` (`{ id, label, blocks }`, page-level tabs produced by
 * middag-php-ui `PageBuilder`) generated into `src/contracts/generated`: that
 * one models page navigation tabs; this one models a content panel's tabs.
 */
export interface TabbedPanelTab {
  key: string;
  label: string;
  icon?: string;
  blocks: import("@/contracts/page-contract").BlockDescriptor[];
}

export interface TabbedPanelBlockData {
  tabs: TabbedPanelTab[];
  defaultTab?: string;
}

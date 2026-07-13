/**
 * Interactive block types — blocks with user interaction beyond read-only display.
 *
 * Community tier: ActionGrid + Tabs. The Pro interactive blocks
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

// ── TabsBlock ────────────────────────────────────────────────────────────────

/**
 * Composite block: organizes inner blocks into tabs. Tab items are the wire
 * `Tab` VO produced by middag-php-ui (`{ id, label, blocks }`); `defaultTab`
 * selects the initially-open tab by `id`.
 */
export interface TabsBlockData {
  tabs: import("@/contracts/generated").Tab[];
  defaultTab?: string;
}

/**
 * Interactive block types — blocks with user interaction beyond read-only display.
 *
 * Community tier: ActionGrid + Tabs, GENERATED from middag-php-ui and re-exported
 * under the stable public names. The extended interactive blocks ship as
 * generated types in their own package.
 */

import type {
  ActionGridBlockData as WireActionGridBlockData,
  ActionGridItem as WireActionGridItem,
} from "@/contracts/generated";

import type { ActionConfirmation } from "./actions";

export type { TabsBlockData } from "@/contracts/generated";

/**
 * A card in the action grid: the generated wire item (the canonical Action plus
 * `title` and `description`) with the client confirmation overlay.
 */
export interface ActionGridItem extends Omit<WireActionGridItem, "confirmation"> {
  confirmation?: ActionConfirmation;
}

/** The generated action-grid payload, with the overlaid items. */
export type ActionGridBlockData = Omit<WireActionGridBlockData, "items"> & {
  items: ActionGridItem[];
};

/**
 * TreeView — data-driven wrapper over the ReUI Tree primitive (@headless-tree).
 *
 * The caller supplies a flat `items` record (id → { label, children }) and a
 * `rootItemId`; the partial builds the headless-tree instance and renders the
 * expand/collapse + keyboard-navigable tree. Kept product-agnostic: no entity
 * coupling, no fetching. Labels are expected already-translated.
 */

import { type ReactElement } from "react";
import { hotkeysCoreFeature, selectionFeature, syncDataLoaderFeature } from "@headless-tree/core";
import { useTree } from "@headless-tree/react";

import { Tree, TreeItem, TreeItemLabel } from "@/components/reui/tree";
import { useTranslation } from "@/i18n/useTranslation";

export interface TreeViewNode {
  /** Visible, already-translated label. */
  label: string;
  /** Child node ids; presence marks the node as a folder. */
  children?: string[];
}

export interface TreeViewProps {
  /** Flat map of node id → node. */
  items: Record<string, TreeViewNode>;
  /** Id of the root node (its children are the top-level rows). */
  rootItemId: string;
  /** Node ids expanded on first render. */
  expandedItems?: string[];
  /** Indentation step in px per depth level. Default 20. */
  indent?: number;
  /** Accessible label for the tree. Defaults to a translated built-in. */
  ariaLabel?: string;
  className?: string;
}

export function TreeView({
  items,
  rootItemId,
  expandedItems,
  indent = 20,
  ariaLabel,
  className,
}: TreeViewProps): ReactElement {
  const { t } = useTranslation();

  const tree = useTree<TreeViewNode>({
    initialState: expandedItems ? { expandedItems } : undefined,
    indent,
    rootItemId,
    getItemName: (item) => item.getItemData().label,
    isItemFolder: (item) => (item.getItemData()?.children?.length ?? 0) > 0,
    dataLoader: {
      getItem: (itemId) => items[itemId],
      getChildren: (itemId) => items[itemId]?.children ?? [],
    },
    features: [syncDataLoaderFeature, hotkeysCoreFeature, selectionFeature],
  });

  // The accessible name lives on a nav landmark wrapping the tree: the ReUI
  // Tree spreads headless-tree's getContainerProps last, which clobbers an
  // aria-label passed straight to <Tree>.
  return (
    <nav aria-label={ariaLabel ?? t("middag.ui.tree.label")} className={className}>
      <Tree indent={indent} tree={tree}>
        {tree.getItems().map((item) => (
          <TreeItem key={item.getId()} item={item}>
            <TreeItemLabel />
          </TreeItem>
        ))}
      </Tree>
    </nav>
  );
}

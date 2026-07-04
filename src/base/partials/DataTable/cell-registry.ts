/**
 * Cell renderer registry — maps cell type keys to React components.
 *
 * Analogous to fieldRegistry for form fields. Consumers can register custom
 * cell renderers without modifying DataTable/index.tsx (Open/Closed principle).
 *
 * Default cell renderers are registered by registerDefaultCells().
 */

import type { ComponentType } from "react";

import type { TimestampFormat } from "@/contracts/block-data";

/**
 * Props that every registered cell renderer receives.
 *
 * Cell-specific config (statusMap, href, entityType, etc.) is accessible
 * via the `column` bag — each renderer extracts what it needs.
 */
export interface CellRendererProps {
  value: unknown;
  row: Record<string, unknown>;
  column: {
    key: string;
    href?: string;
    entityType?: string;
    entityIdField?: string;
    statusMap?: Record<string, string>;
    timestampFormat?: TimestampFormat;
  };
}

const cellRegistry = new Map<string, ComponentType<CellRendererProps>>();

/**
 * Register a cell renderer for a given cell type key.
 */
export function registerCellRenderer(
  type: string,
  component: ComponentType<CellRendererProps>,
): void {
  cellRegistry.set(type, component);
}

/**
 * Resolve a cell renderer by type key. Returns undefined if not registered.
 */
export function resolveCellRenderer(type: string): ComponentType<CellRendererProps> | undefined {
  return cellRegistry.get(type);
}

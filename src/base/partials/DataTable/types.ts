/**
 * DataTable types — column definitions, pagination, sorting, filtering, and actions.
 *
 * @see NV-05-ux-blocks.md
 */

import type { ReactNode } from "react";

import type { EmptyPlaceholderCTA } from "@/base/partials/EmptyPlaceholder";
import type { AppliedFilters, FilterDef } from "@/base/partials/FilterBar";
import type { ExecutableAction, TimestampFormat } from "@/contracts/block-data";

// ---------------------------------------------------------------------------
// Column
// ---------------------------------------------------------------------------

export type DataTableCellType =
  | "text"
  | "status"
  | "boolean"
  | "timestamp"
  | "link"
  | "custom"
  | "rich_status"
  | "html"
  | "link_group"
  | "annotated"
  | "progress";

export interface DataTableColumn<TData> {
  /** Unique column key, must match a property of TData (or use `render` for computed). */
  key: string;
  /** Header label text. */
  label: string;
  /** Cell type — controls default rendering. Defaults to "text". */
  type?: DataTableCellType;
  /** Display format for type="timestamp" columns. Defaults to "relative". */
  timestampFormat?: TimestampFormat;
  /** Whether the column is sortable. Defaults to false. */
  sortable?: boolean;
  /** Whether the column can be hidden via column visibility. Defaults to true. */
  hideable?: boolean;
  /** Whether the column is visible by default. Defaults to true. */
  visible?: boolean;
  /** Fixed width in pixels. When omitted, column auto-sizes. */
  width?: number;
  /** Min width in pixels. */
  minWidth?: number;
  /** URL pattern for link cells. Interpolated per row (e.g. "/organizations/{organizationId}"). */
  href?: string;
  /** Entity type for link resolution (from PageContract.entities map). */
  entityType?: string;
  /** Field name in row data containing the entity ID. */
  entityIdField?: string;
  /** Custom cell renderer. Overrides type-based rendering. */
  render?: (value: unknown, row: TData) => ReactNode;
  /** Status-to-semantic mapping for type="status" columns. Maps status string to a semantic intent. */
  statusMap?: Record<
    string,
    "success" | "warning" | "destructive" | "secondary" | "info" | "default"
  >;
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

export interface DataTablePagination {
  /** Current page index (0-based). */
  page: number;
  /** Rows per page. */
  perPage: number;
  /** Total number of rows across all pages. */
  total: number;
  /** Available page size options. Defaults to [10, 25, 50, 100]. */
  pageSizes?: number[];
}

// ---------------------------------------------------------------------------
// Sorting
// ---------------------------------------------------------------------------

export interface DataTableSort {
  /** Column key being sorted. */
  key: string;
  /** Sort direction. */
  direction: "asc" | "desc";
}

// ---------------------------------------------------------------------------
// Filters (re-exports + DataTable-scoped aliases)
// ---------------------------------------------------------------------------

export type DataTableFilterOption = { value: string; label: string };

export type DataTableFilterDef = FilterDef;

export type DataTableAppliedFilters = AppliedFilters;

// ---------------------------------------------------------------------------
// Row actions
// ---------------------------------------------------------------------------

export interface DataTableRowAction<TData> {
  /** Unique action id. */
  id: string;
  /** Visible label. */
  label: string;
  /** Icon name (kebab-case, resolved via getIcon). */
  icon?: string;
  /** Visual intent for dangerous actions. */
  intent?: "default" | "danger";
  /** Display variant: 'icon' (default) or 'button' (text label visible). */
  variant?: "icon" | "button";
  /** Called when the action is triggered. */
  onAction: (row: TData) => void;
  /** Conditionally hide the action per row. */
  hidden?: (row: TData) => boolean;
  /** Conditionally disable the action per row. */
  disabled?: (row: TData) => boolean;
  /** Show loading spinner instead of icon per row. */
  loading?: (row: TData) => boolean;
  /** Return disabled reason text for tooltip per row. */
  disabledReason?: (row: TData) => string | undefined;
}

// ---------------------------------------------------------------------------
// Bulk actions (re-export alias)
// ---------------------------------------------------------------------------

export type DataTableBulkAction = ExecutableAction;

// ---------------------------------------------------------------------------
// Param change callback
// ---------------------------------------------------------------------------

export interface DataTableParamChange {
  page?: number;
  perPage?: number;
  sort?: DataTableSort | null;
  search?: string;
  filters?: DataTableAppliedFilters;
}

// ---------------------------------------------------------------------------
// DataTableProps
// ---------------------------------------------------------------------------

export interface DataTableProps<TData> {
  /** Column definitions. */
  columns: DataTableColumn<TData>[];
  /** Row data. */
  rows: TData[];
  /** Unique key extractor for each row. String property name or function. */
  rowKey: keyof TData | ((row: TData) => string);

  /** Server-driven pagination state. */
  pagination?: DataTablePagination;
  /** Current sort state. */
  sort?: DataTableSort;

  /** Available filter definitions. */
  filters?: DataTableFilterDef[];
  /** Currently applied filters. */
  appliedFilters?: DataTableAppliedFilters;

  /** Row-level actions (shown on hover by default). */
  rowActions?: DataTableRowAction<TData>[];
  /** When true, row actions are always visible instead of hover-only. */
  actionsAlwaysVisible?: boolean;
  /** Bulk actions for selected rows. */
  bulkActions?: DataTableBulkAction[];

  /** Whether data is currently loading. */
  isLoading?: boolean;

  /** Placeholder for the search input. */
  searchPlaceholder?: string;
  /** Initial search value (controlled externally). */
  searchValue?: string;

  /** Empty state: icon name (kebab-case). */
  emptyStateIcon?: string;
  /** Empty state: title text. */
  emptyStateTitle?: string;
  /** Empty state: description text. */
  emptyStateDescription?: string;
  /** Empty state: CTA button. */
  emptyStateCTA?: EmptyPlaceholderCTA;

  /** Callback when any table parameter changes (page, sort, search, filters). */
  onParamChange?: (params: DataTableParamChange) => void;
  /** Callback when a bulk action is triggered. Receives action id + selected row keys. */
  onBulkAction?: (actionId: string, selectedKeys: string[]) => void;

  /** Callback when a row is clicked (e.g. to open inspector). */
  onRowClick?: (row: TData) => void;
  /** Key of the currently selected row (for visual highlight). */
  selectedRowKey?: string;

  /**
   * Persist client-only view state (column visibility, density) across Inertia
   * history navigation. Driven by `BlockDescriptor.remember` from the backend.
   * When false (default), state is plain `useState` (lost on back/forward).
   */
  remember?: boolean;
  /** Stable, unique key scoping the remembered state (use `block.key`). */
  rememberKey?: string;
}

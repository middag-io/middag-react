/**
 * Data display block types — read-only blocks that present information.
 *
 * Includes DenseTable, MetricCard, EmptyState, StatusStrip, DetailPanel,
 * ActivityTimeline, MarkdownPanel, CardGrid, LinkList, and WorkflowProgress.
 */

import type { ConditionalAction, ExecutableAction } from "./actions";
import type { EmptyStateDef, EntityRef } from "./shared";

// ── DenseTableBlock ──────────────────────────────────────────────────────────

/** Display format for `timestamp` column values. Defaults to "relative". */
export type TimestampFormat = "relative" | "datetime" | "date" | "time" | "iso";

export interface DenseTableColumnDef {
  key: string;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  variant?:
    | "text"
    | "status"
    | "badge"
    | "boolean"
    | "timestamp"
    | "link"
    | "rich_status"
    | "html"
    | "link_group"
    | "annotated"
    | "progress";
  /** Display format for `variant: "timestamp"` columns. Defaults to "relative". */
  timestampFormat?: TimestampFormat;
  /** URL pattern for link columns. Interpolated per row (e.g. "/organizations/{organizationId}"). */
  href?: string;
  /** Entity reference for link resolution via PageContract.entities map. */
  entity?: EntityRef;
  minWidth?: number;
}

export interface DenseTablePagination {
  page: number;
  perPage: number;
  total: number;
  lastPage: number;
}

export interface DenseTableSort {
  column: string | null;
  direction: "asc" | "desc" | null;
}

export interface DenseTableFilterDef {
  key: string;
  label: string;
  type: "select" | "multiselect" | "date_range";
  options?: Array<{ value: string; label: string }>;
}

// ── Rich column value types ─────────────────────────────────────────────────

export interface RichStatusValue {
  label: string;
  appearance: "success" | "warning" | "danger" | "info" | "neutral";
  icon?: string;
}

/** Structured value for the `annotated` column variant. */
export interface AnnotatedValue {
  /** Primary text. */
  text: string;
  /** Optional prefix badge (colored square with 1-2 characters). */
  badge?: { label: string; color: string };
  /** Optional secondary text (rendered in muted mono below the primary text). */
  sublabel?: string;
  /** Semantic color applied to the primary text. */
  appearance?: "success" | "warning" | "danger" | "info" | "neutral";
}

/** Structured value for the `progress` column variant. */
export interface ProgressValue {
  /** Current value. */
  value: number;
  /** Maximum value the bar represents. Defaults to 100. */
  max?: number;
  /** Label shown beside the bar. Defaults to the computed percentage (e.g. "75%"). */
  label?: string;
  /** Semantic color applied to the bar fill. Defaults to the primary color. */
  appearance?: "success" | "warning" | "danger" | "info" | "neutral";
}

export interface LinkGroupItem {
  icon: string;
  href: string | null;
  label: string;
  external?: boolean;
}

export interface DenseTableBlockData {
  columns: DenseTableColumnDef[];
  rows: Record<string, unknown>[];
  pagination: DenseTablePagination;
  sort: DenseTableSort;
  filters: {
    available: DenseTableFilterDef[];
    applied: Record<string, string | string[]>;
  };
  /** URL pattern for row click navigation. Interpolated per row (e.g. "/organizations/{id}"). */
  rowHref?: string;
  rowActions?: ConditionalAction[];
  bulkActions?: ExecutableAction[];
  searchPlaceholder?: string;
  emptyState?: EmptyStateDef;
}

// ── MetricCardBlock ──────────────────────────────────────────────────────────

export interface MetricCardBlockData {
  value: string | number;
  delta?: string;
  deltaDirection?: "positive" | "negative" | "neutral";
  label: string;
  icon?: string;
  href?: string;
  locale?: string;
  compact?: boolean;
}

// ── EmptyStateBlock ──────────────────────────────────────────────────────────

export type EmptyStateVariant = "first-use" | "no-results" | "error" | "permission";

export interface EmptyStateBlockData {
  variant?: EmptyStateVariant;
  icon?: string;
  /** URL to a Lottie JSON animation. When provided, replaces the icon with an animated illustration. */
  lottieUrl?: string;
  description: string;
  cta?: {
    label: string;
    href?: string;
    method?: "get" | "post";
  };
  ctaSecondary?: {
    label: string;
    href: string;
  };
}

// ── StatusStripBlock ─────────────────────────────────────────────────────────

export type StatusStripTone = "success" | "warning" | "danger" | "neutral";
export type StatusItemAppearance = "success" | "warning" | "danger" | "info" | "neutral";

export interface StatusStripItem {
  key: string;
  label: string;
  value: string;
  appearance: StatusItemAppearance;
  tooltip?: string;
  href?: string;
}

export interface StatusStripBlockData {
  score?: number;
  tone?: StatusStripTone;
  items: StatusStripItem[];
}

// ── DetailPanelBlock ─────────────────────────────────────────────────────────

export interface DetailPanelFieldDef {
  key: string;
  label: string;
  value: string | number | boolean | null;
  kind?: "text" | "status" | "timestamp" | "boolean" | "link" | "code" | "email";
  copyable?: boolean;
  href?: string;
  /**
   * Entity link for this field value.
   * Unlike DenseTable (where entity.id is a field name in the row), here
   * entity.id is the actual entity ID value (e.g. 1, "abc") because
   * DetailPanel fields carry inline values, not tabular rows.
   */
  entity?: { type: string; id: string | number };
}

export interface DetailPanelSectionDef {
  id: string;
  title: string;
  fields: DetailPanelFieldDef[];
  defaultCollapsed?: boolean;
  actions?: ExecutableAction[];
}

export interface DetailPanelBlockData {
  sections: DetailPanelSectionDef[];
  columns?: 1 | 2;
}

// ── ActivityTimelineBlock ────────────────────────────────────────────────────

export interface ActivityTimelineEntry {
  id: string;
  actor: string;
  actorHref?: string;
  action: string;
  detail?: string;
  icon: string;
  color: "success" | "info" | "warning" | "destructive" | "neutral";
  timestamp: number;
  /**
   * Optional read/acknowledge affordance. When `markReadHref` is present
   * the block renders a "mark as read" action that POSTs to it; `read` reflects
   * the current acknowledged state (a read entry hides the action / dims). Both
   * are additive and optional — entries without them render unchanged.
   */
  read?: boolean;
  markReadHref?: string;
}

export interface ActivityTimelineBlockData {
  groups: Array<{
    label: string;
    entries: ActivityTimelineEntry[];
  }>;
  hasMore?: boolean;
  loadMoreHref?: string;
  limit?: number;
}

// ── MarkdownPanelBlock ───────────────────────────────────────────────────────

export interface MarkdownPanelBlockData {
  content: string;
  maxHeight?: number;
}

// ── CardGridBlock ───────────────────────────────────────────────────────────

export interface CardGridColumnDef {
  key: string;
  label: string;
  kind?: "text" | "status" | "badge" | "boolean" | "timestamp" | "number";
}

export interface CardGridBlockData {
  columns: CardGridColumnDef[];
  rows: Record<string, unknown>[];
  variant?: "default" | "store" | "connector";
  emptyState?: EmptyStateDef;
}

// ── LinkListBlock ───────────────────────────────────────────────────────────

export interface LinkListItem {
  label: string;
  href: string | null;
  icon?: string;
  description?: string;
  external?: boolean;
}

export interface LinkListBlockData {
  items: LinkListItem[];
}

// ── WorkflowProgressBlock ───────────────────────────────────────────────────

export interface WorkflowProgressState {
  /** Unique key, e.g. "draft", "active", "expired" */
  key: string;
  /** Localized display label */
  label: string;
  /** Timestamp when this state was reached (ISO 8601). Shown for past/current states. */
  timestamp?: string;
}

export interface WorkflowProgressBlockData {
  /** Ordered list of workflow states (left to right) */
  states: WorkflowProgressState[];
  /** Key of the current active state. Must match one of states[].key */
  currentState: string;
}

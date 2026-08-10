/**
 * Data display block types — read-only blocks that present information.
 *
 * Includes DenseTable, MetricCard, EmptyState, StatusStrip, DetailPanel,
 * ActivityTimeline, MarkdownPanel, CardGrid, and LinkList.
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
  /**
   * Cap in pixels. Longer content is clipped to one line with an ellipsis, and
   * the full value stays in the DOM as the cell's `title`.
   *
   * Without a cap a column grows until the widest value fits, so a single long
   * row can push the table past the width of the page. Capping in the column
   * keeps the value intact — selectable, searchable by the browser, readable on
   * hover — where trimming it in the data would not.
   */
  maxWidth?: number;
  /**
   * Status value → semantic intent, for `variant: "status"` and `"badge"`.
   *
   * Those variants resolve their colour by looking the displayed text up in a
   * built-in English map, so a translated label matches nothing and every row
   * renders neutral. Supplying the mapping for the labels this column actually
   * shows is what lets a localized status column keep its colours. Keys are
   * matched case-insensitively.
   */
  statusMap?: Record<string, StatusIntent>;
}

/** Semantic intents a status cell can resolve to. */
export type StatusIntent = "success" | "warning" | "destructive" | "secondary" | "info" | "default";

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
  /**
   * The toolbar's "save as view" control.
   *
   * Absent, the control does not render — it has no meaning on a table whose
   * page has nowhere to keep a view. Present, it fires this action, and the
   * page decides what saving means: the table knows the current query, but not
   * that views exist.
   *
   * `saveViewActive` fills the star, for pages where the control toggles rather
   * than only creates.
   */
  saveViewAction?: ExecutableAction;
  saveViewActive?: boolean;
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
  /**
   * Short text pinned to the right of the row — a count, a total, a shortcut.
   *
   * A facet list reads as two columns: what it is on the left, how many on the
   * right. Folded into the label it becomes part of the name and the eye has to
   * parse each row to find the number.
   */
  trailing?: string;
  /**
   * Marks the row as the current selection, drawn as a filled background.
   *
   * A list that filters something needs to say which entry is doing it. Without
   * this the only way to state it is inside the label text, which reads as part
   * of the name rather than as state.
   */
  active?: boolean;
}

export interface LinkListBlockData {
  items: LinkListItem[];
}

// ── ChartBlock (free) ────────────────────────────────────────────────────────

export interface ChartSeries {
  /** Field key on each data row this series plots. */
  key: string;
  /** Human-facing series label. */
  label: string;
  /** Optional CSS color token, e.g. "var(--chart-1)". */
  color?: string;
}

export interface ChartBlockData {
  chartType: "line" | "bar" | "area";
  /** Field key on each data row used for the x-axis category. */
  categoryKey: string;
  series: ChartSeries[];
  data: Record<string, unknown>[];
  options?: { showLegend?: boolean; showGrid?: boolean };
}

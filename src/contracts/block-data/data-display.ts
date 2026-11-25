/**
 * Data display block types — read-only blocks that present information.
 *
 * Includes DenseTable, MetricCard, EmptyState, StatusStrip, DetailPanel,
 * ActivityTimeline, MarkdownPanel, CardGrid, LinkList and Chart.
 *
 * GENERATED from middag-php-ui (the canonical wire contract: PHP schema-only
 * value objects → JSON Schema → these types). This module re-exports them under
 * the stable public names. Open enums (variants, tones, formats, intents) are
 * typed as their known values or any other string; PHP may send an empty map
 * as `[]` (rows, filters), so consumers normalise at the block boundary (see
 * `@/base/utils/php-wire`).
 */

import type { StatusStripItem } from "@/contracts/generated";

export type {
  ActivityTimelineBlockData,
  ActivityTimelineEntry,
  AnnotatedValue,
  CardGridBlockData,
  CardGridColumnDef,
  CardGridVariant,
  ChartBlockData,
  ChartSeries,
  DeltaDirection,
  DenseTableBlockData,
  DenseTableColumnDef,
  DenseTableFilterDef,
  DenseTablePagination,
  DenseTableSort,
  DetailPanelBlockData,
  DetailPanelFieldDef,
  DetailPanelSectionDef,
  EmptyStateBlockData,
  EmptyStateVariant,
  LinkGroupItem,
  LinkListBlockData,
  LinkListItem,
  MarkdownPanelBlockData,
  MetricCardBlockData,
  ProgressValue,
  RichStatusValue,
  StatusIntent,
  StatusStripBlockData,
  StatusStripItem,
  StatusStripTone,
  TimestampFormat,
} from "@/contracts/generated";

/** Semantic appearance of a status-strip item. */
export type StatusItemAppearance = StatusStripItem["appearance"];

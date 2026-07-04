/**
 * Registers all built-in cell renderers in the cell registry.
 *
 * Called by registerDefaults(). Consumers can register custom cell types
 * (e.g. registerCellRenderer("sparkline", SparklineCell)) without modifying
 * DataTable/index.tsx.
 */

import { registerCellRenderer } from "./cell-registry";
import {
  AnnotatedCell,
  BooleanCell,
  HtmlCell,
  LinkCell,
  LinkGroupCell,
  ProgressCell,
  RichStatusCell,
  StatusCell,
  TimestampCell,
} from "./cell-renderers";

let registered = false;

export function registerDefaultCells(): void {
  if (registered) return;
  registered = true;

  registerCellRenderer("status", StatusCell);
  registerCellRenderer("boolean", BooleanCell);
  registerCellRenderer("timestamp", TimestampCell);
  registerCellRenderer("link", LinkCell);
  registerCellRenderer("rich_status", RichStatusCell);
  registerCellRenderer("html", HtmlCell);
  registerCellRenderer("link_group", LinkGroupCell);
  registerCellRenderer("annotated", AnnotatedCell);
  registerCellRenderer("progress", ProgressCell);
}

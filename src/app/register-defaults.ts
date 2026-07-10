/**
 * register-defaults — populates the registries with core shells,
 * layouts and the standard Community block types available out-of-the-box.
 *
 * The 6 heavy/interactive blocks (chart_panel, flow_editor, condition_tree,
 * sentence_builder, form_builder, kanban_board) and the rich ProductShell +
 * chrome are Pro: they register via @middag-io/react-pro's registerProDefaults()
 * (which overrides the `product` shell fallback). The Community engine ships the
 * ImmersiveShell + the standard Community blocks (form_panel included — heavy deps lazy).
 *
 * IIFE consumers (WordPress) should NOT call this function. Instead, import
 * individual blocks from the barrel and call registerBlock() selectively to
 * avoid bundling heavy deps via inlineDynamicImports.
 */

import { registerBlock, registerLayout, registerShell } from "@/app/registries";
import { ActionGridBlock } from "@/base/blocks/ActionGridBlock";
import { ActivityTimelineBlock } from "@/base/blocks/ActivityTimelineBlock";
import { CardGridBlock } from "@/base/blocks/CardGridBlock";
import { ChartBlock } from "@/base/blocks/ChartBlock";
import { DenseTableBlock } from "@/base/blocks/DenseTableBlock";
import { DetailPanelBlock } from "@/base/blocks/DetailPanelBlock";
import { EmptyStateBlock } from "@/base/blocks/EmptyStateBlock";
import { FormPanelBlockLazy } from "@/base/blocks/FormPanelBlock.lazy";
import { LinkListBlock } from "@/base/blocks/LinkListBlock";
import { MarkdownPanelBlock } from "@/base/blocks/MarkdownPanelBlock";
import { MetricCardBlock } from "@/base/blocks/MetricCardBlock";
import { StatusStripBlock } from "@/base/blocks/StatusStripBlock";
import { TabsBlock } from "@/base/blocks/TabsBlock";
import { registerDefaultFields } from "@/base/form/fields/register-default-fields";
import { DashboardLayout } from "@/base/layout/DashboardLayout";
import { SidebarLayout } from "@/base/layout/SidebarLayout";
import { StackLayout } from "@/base/layout/StackLayout";
import { WizardLayout } from "@/base/layout/WizardLayout";
import { registerDefaultCells } from "@/base/partials/DataTable/register-default-cells";
import { AuthShell } from "@/base/shell/AuthShell";
import { BasicShell } from "@/base/shell/BasicShell";
import { ImmersiveShell } from "@/base/shell/ImmersiveShell";
import { registerDefaultIcons } from "@/base/utils/register-default-icons";

let registered = false;

export function registerDefaults(): void {
  if (registered) return;
  registered = true;

  // Shells — the Community engine ships BasicShell (simple sidebar + header) and
  // ImmersiveShell (focused, no sidebar). The rich `product` shell registers
  // via @middag-io/react-pro's registerProDefaults().
  registerShell("basic", BasicShell);
  registerShell("immersive", ImmersiveShell);
  // `auth` — chromeless centered card for guest entry points (login).
  registerShell("auth", AuthShell);

  // Layouts
  registerLayout("stack", StackLayout);
  registerLayout("sidebar", SidebarLayout);
  registerLayout("dashboard", DashboardLayout);
  registerLayout("wizard", WizardLayout);

  // Blocks (standard Community — the remaining Pro/interactive blocks register via @middag-io/react-pro)
  registerBlock("dense_table", DenseTableBlock);
  registerBlock("empty_state", EmptyStateBlock);
  registerBlock("metric_card", MetricCardBlock);
  registerBlock("status_strip", StatusStripBlock);
  registerBlock("detail_panel", DetailPanelBlock);
  registerBlock("activity_timeline", ActivityTimelineBlock);
  registerBlock("markdown_panel", MarkdownPanelBlock);
  registerBlock("card_grid", CardGridBlock);
  registerBlock("action_grid", ActionGridBlock);
  registerBlock("link_list", LinkListBlock);
  registerBlock("tabs", TabsBlock);
  // form_panel ships in the Community engine but its heavy deps (react-hook-form
  // + zod) are code-split: FormPanelBlockLazy loads the real block on first render.
  registerBlock("form_panel", FormPanelBlockLazy);
  // chart — free-tier line/bar/area renderer. The richer `chart_panel` (pie,
  // playground, config UI) is Pro.
  registerBlock("chart", ChartBlock);

  // Form field components
  registerDefaultFields();

  // Icons (block icons + navigation icons + entity icons)
  registerDefaultIcons();

  // Cell renderers (DataTable column types)
  registerDefaultCells();
}

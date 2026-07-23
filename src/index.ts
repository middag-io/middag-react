/**
 * @middag-io/react — barrel export for ESM lib build.
 *
 * Exports the reusable core of the MIDDAG React UI:
 *   - Contracts (TypeScript types/interfaces)
 *   - ContractPage (page renderer)
 *   - Registries (shell, layout, block registration + resolution)
 *   - Theme utilities
 *   - Providers (i18n, auth, flash, scope, progress)
 *   - Hooks
 */

// Design system CSS — tokens, theme, and all Tailwind utilities used by components.
// Consumers import via: import "@middag-io/react/style.css"
import "./tailwind.css";

// ── Contracts: Page ─────────────────────────────────────────────────────────

export type {
  Breadcrumb,
  PageAction,
  PageMeta,
  BlockDescriptor,
  LayoutDescriptor,
  PageResources,
  PageContract,
  ContractPageProps,
} from "@/contracts/page-contract";

// ── Contracts: Shared Props ─────────────────────────────────────────────────

export type {
  SharedPropsAuth,
  SharedPropsTheme,
  SharedPropsFlash,
  AdminTabItem,
  AdminTabsProps,
  SharedProps,
} from "@/contracts/shared-props";

// ── Contracts: Navigation ───────────────────────────────────────────────────

export type {
  NavigationEntityType,
  NavigationNode,
  NavigationTreePayload,
} from "@/contracts/navigation";

// ── Contracts: Block Data ───────────────────────────────────────────────────

export type {
  // Action hierarchy
  ActionIntent,
  ActionMethod,
  ActionConfirmation,
  ActionBase,
  ExecutableAction,
  ConditionalAction,
  // Entity reference
  EntityRef,
  // DenseTable
  DenseTableColumnDef,
  TimestampFormat,
  DenseTablePagination,
  DenseTableSort,
  DenseTableFilterDef,
  DenseTableBlockData,
  // Rich column values
  RichStatusValue,
  LinkGroupItem,
  AnnotatedValue,
  ProgressValue,
  // MetricCard
  MetricCardBlockData,
  // EmptyState
  EmptyStateVariant,
  EmptyStateBlockData,
  // StatusStrip
  StatusStripTone,
  StatusItemAppearance,
  StatusStripItem,
  StatusStripBlockData,
  // DetailPanel
  DetailPanelFieldDef,
  DetailPanelSectionDef,
  DetailPanelBlockData,
  // ActivityTimeline
  ActivityTimelineEntry,
  ActivityTimelineBlockData,
  // FormPanel
  FormFieldType,
  FormCondition,
  FormFieldValidation,
  FormFieldDocumentMask,
  FormFieldEntityOption,
  FieldPropsBase,
  OptionFieldProps,
  SimpleFormField,
  TextareaFormField,
  NumericFormField,
  SelectFormField,
  MultiSelectFormField,
  OtpFormField,
  SliderFormField,
  NativeSelectFormField,
  BooleanFormField,
  DateFormField,
  DurationFormField,
  FileFormField,
  EntityPickerFormField,
  PhoneFormField,
  DocumentFormField,
  CurrencyFormField,
  SlugFormField,
  TagsFormField,
  HiddenFormField,
  StaticFormField,
  HeaderFormField,
  FormFieldNode,
  FormSectionNode,
  FormGroupNode,
  FormHeaderNode,
  FormSchemaNode,
  FormMethod,
  FormValidationMode,
  FieldError,
  FormErrors,
  FormPanelBlockData,
  // MarkdownPanel
  MarkdownPanelBlockData,
  // CardGrid
  CardGridColumnDef,
  CardGridBlockData,
  // ActionGrid
  ActionGridItem,
  ActionGridBlockData,
  // LinkList
  LinkListItem,
  LinkListBlockData,
  // Tabs
  TabsBlockData,
  // Form: rating + date_range
  RatingFormField,
  DateRangeFormField,
  // Chart (free)
  ChartSeries,
  ChartBlockData,
} from "@/contracts/block-data";

// ── Contracts: Validation ────────────────────────────────────────────────────

export {
  pageContractSchema,
  validatePageContract,
  type PageContractValidationError,
} from "@/contracts/page-contract-schema";

// ── Contracts: Connectors ───────────────────────────────────────────────────

export type {
  ConnectorStatus,
  CredentialField,
  HealthCheckResult,
  ConnectorListItem,
  ConnectorDetail,
  ConnectorTypeInfo,
} from "@/contracts/connectors";

// ── App Core ────────────────────────────────────────────────────────────────

export { ContractPage } from "@/engine/ContractPage";
export {
  shellRegistry,
  layoutRegistry,
  blockRegistry,
  registerShell,
  registerLayout,
  registerBlock,
  resolveShell,
  resolveLayout,
  resolveBlock,
  type ShellProps,
  type LayoutProps,
  type BlockProps,
} from "@/engine/registries";
export {
  registerFieldComponent,
  resolveFieldComponent,
  type FieldComponentProps,
} from "@/base/form/fields/field-registry";
export {
  registerIcon,
  resolveIcon,
  registerEntityIcon,
  resolveEntityIcon,
} from "@/base/utils/icon-registry";
export {
  registerCellRenderer,
  resolveCellRenderer,
  type CellRendererProps,
} from "@/base/partials/DataTable/cell-registry";
export { registerDefaults } from "@/engine/register-defaults";
export { registerDefaultCells } from "@/base/partials/DataTable/register-default-cells";
export { registerDefaultFields } from "@/base/form/fields/register-default-fields";
export { registerDefaultIcons } from "@/base/utils/register-default-icons";
export { LazyBlock, isLazyBlock } from "@/engine/LazyBlock";
export { EntityRoutesProvider, useEntityRoute, EntityLink } from "@/engine/EntityRoutes";
export { HostSlot } from "@/engine/HostSlot";

// ── Base partials (reusable UI blocks for consumers) ─────────────────────────

export * from "@/base/partials";

// ── Theme ───────────────────────────────────────────────────────────────────

export {
  getStoredAppearance,
  setAppearance,
  cycleAppearance,
  getEffectiveTheme,
  applyTheme,
  toggleDir,
  initDir,
  onSystemThemeChange,
  type Appearance,
  type EffectiveTheme,
} from "@/base/theme/appearance";

export {
  MIDDAGThemeProvider,
  useThemeOverrides,
  getThemeOverrides,
  THEME_IDS,
  THEME_CLASSES,
  THEME_SIDEBAR_DIMS,
  type ThemeId,
  type ThemeOverrides,
  type BadgeOverrides,
  type ButtonOverrides,
  type TabsOverrides,
  type TableOverrides,
  type CardOverrides,
} from "@/base/theme/theme-context";

export {
  initHostHeaderHeight,
  setHostHeaderHeight,
  destroyHostHeaderHeight,
} from "@/base/theme/host-layout-detector";

// ── Providers ───────────────────────────────────────────────────────────────

export { I18nProvider, type I18nProviderProps } from "@/i18n/I18nProvider";
export { useTranslation, type UseTranslationResult } from "@/i18n/useTranslation";
export { useHostString } from "@/i18n/useHostString";
export { setHostStringResolver, type HostStringResolver } from "@/i18n/host-resolver";
export { renderLabel, isTranslatableLabel } from "@/i18n/render-label";
export { resolveFieldError } from "@/i18n/resolve-field-error";
export { i18n, i18nReady, normalizeLocale } from "@/i18n/instance";
export { registerUiStrings } from "@/i18n/register-strings";

export { AuthProvider, useAuth, Can, Cannot } from "@/engine/providers/auth";
export { FlashProvider } from "@/engine/providers/flash";
export {
  ScopeProvider,
  useScope,
  useScopeKey,
  type ScopeContextValue,
} from "@/engine/providers/scope";
export { ProgressProvider } from "@/engine/providers/progress";

export {
  ErrorReporterProvider,
  useErrorReporter,
  type ErrorReporter,
  type ErrorContext,
} from "@/engine/providers/error-reporter";
export { InertiaErrorReporter } from "@/engine/providers/inertia-error-reporter";

// ── Sidebar (for consumer shells) ──────────────────────────────────────────

export {
  SidebarProvider,
  useSidebar,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/primitives/reui/sidebar";

// ── Storage ────────────────────────────────────────────────────────────────

export { setStoragePrefix, getStoragePrefix, storageKey } from "@/base/utils/storage";

// ── Hooks ───────────────────────────────────────────────────────────────────

export { useIsDark } from "@/base/hooks/useIsDark";
export { useLazyTabs } from "@/base/hooks/useLazyTabs";
export type { UseLazyTabsReturn } from "@/base/hooks/useLazyTabs";
export { useRemember } from "@/base/hooks/useRemember";

// ── Shells (for selective registration) ─────────────────────────────────────
//
// The Community engine ships ImmersiveShell only. The rich ProductShell + chrome
// panels (SidebarNav, PageHeader, PageFilterTabs, AppearanceToggle,
// CommandPalette, HelpPanel, InlineInspector, BoostSearchBar) ship in
// @middag-io/react-pro and register via registerProDefaults().

export { AuthShell } from "@/base/shell/AuthShell";
export { BasicShell } from "@/base/shell/BasicShell";
export { ImmersiveShell } from "@/base/shell/ImmersiveShell";

// ── Shell partials (Community building blocks for custom shells) ────────────

export { NavErrorBoundary } from "@/base/shell/partials/NavErrorBoundary";
export { useInspector, type InspectorResponse } from "@/base/shell/partials/InspectorContext";
// Editable panel — free contract-driven side drawer (context + provider + renderer).
export {
  useEditablePanel,
  type EditablePanelConfig,
  type EditablePanelDescriptor,
} from "@/base/shell/partials/EditablePanelContext";
export { EditablePanelProvider } from "@/base/shell/partials/EditablePanelProvider";
export { InlineEditablePanel } from "@/base/shell/partials/InlineEditablePanel";

// ── ReUI components (for consumer/mock shells) ────────────────────────────
// These must be exported from the barrel so dist-mock can externalize them
// to @middag-io/react — shared React context requires a single module instance.

export { Toaster } from "@/primitives/reui/sonner";
export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/primitives/reui/tooltip";
export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/primitives/reui/dropdown-menu";

// ── reui primitives (host-runtime barrel surface) ───────────────────────────
// Surface lives in its own reui index module (exposed through the root barrel only).
export * from "@/primitives/reui";

// ── Utils (barrel-root for host-runtime consumers) ──────────────────────────
export { cn } from "@/lib/utils";

// ── Assets ────────────────────────────────────────────────────────────────

export { lottie } from "@/assets/lottie";

// ── Layouts (for selective registration) ────────────────────────────────────

export { BlockRegion } from "@/base/layout/BlockRegion";
export { StackLayout } from "@/base/layout/StackLayout";
export { SidebarLayout } from "@/base/layout/SidebarLayout";
export { DashboardLayout } from "@/base/layout/DashboardLayout";
export { WizardLayout } from "@/base/layout/WizardLayout";

// ── Blocks (for selective registration) ─────────────────────────────────────
//
// IIFE consumers (e.g. WordPress) should import only the blocks they use
// and call registerBlock() individually, instead of registerDefaults()
// which pulls in all standard Community blocks (form_panel's heavy deps load lazily).

export { DenseTableBlock } from "@/base/blocks/DenseTableBlock";
export { EmptyStateBlock } from "@/base/blocks/EmptyStateBlock";
export { MetricCardBlock } from "@/base/blocks/MetricCardBlock";
export { StatusStripBlock } from "@/base/blocks/StatusStripBlock";
export { DetailPanelBlock } from "@/base/blocks/DetailPanelBlock";
export { ActivityTimelineBlock } from "@/base/blocks/ActivityTimelineBlock";
export { MarkdownPanelBlock } from "@/base/blocks/MarkdownPanelBlock";
export { CardGridBlock } from "@/base/blocks/CardGridBlock";
export { ActionGridBlock } from "@/base/blocks/ActionGridBlock";
export { LinkListBlock } from "@/base/blocks/LinkListBlock";
export { TabsBlock } from "@/base/blocks/TabsBlock";
export { ChartBlock } from "@/base/blocks/ChartBlock";
// form_panel is a Community block; its heavy deps (react-hook-form + zod) are
// code-split. The barrel exports the lazy Suspense wrapper AS FormPanelBlock so
// the heavy module loads on demand (never eagerly) — whether registered via
// registerDefaults() or manually in an IIFE consumer. Import the raw component
// from "@/base/blocks/FormPanelBlock" only if you need it without Suspense.
export { FormPanelBlockLazy as FormPanelBlock } from "@/base/blocks/FormPanelBlock.lazy";

// FormField — the per-field router used by form_panel. Exported so consumers
// (and @middag-io/react-pro) can render individual schema fields outside a full
// form, reusing every registered field component.
export { FormField, type FormFieldProps } from "@/base/form/FormField";

// The Pro/interactive block components (chart_panel, flow_editor,
// condition_tree, sentence_builder, form_builder, kanban_board) ship in
// @middag-io/react-pro, not here. registerDefaults() registers the standard Community
// blocks; call registerProDefaults() from @middag-io/react-pro/runtime to add
// the Pro blocks (and the rich ProductShell).

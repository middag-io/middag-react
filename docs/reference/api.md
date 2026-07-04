# API Reference

Complete reference for all public exports from `@middag-io/react`.

::: info Import path
All exports are available from the package root: `import { ... } from '@middag-io/react'`. Types are exported with the `type` keyword.
:::

## Components {#components}

### ContractPage

Main page renderer. Resolves shell, layout, and blocks from registries based on the PageContract. This is the only component most consumers need.

```tsx
<ContractPage contract={contract} overlay? help? inspector? />
```

| Prop        | Type            | Required | Default | Description                                                               |
|-------------|-----------------|----------|---------|---------------------------------------------------------------------------|
| `contract`  | `PageContract`  | Yes      |         | The page contract describing shell, layout, and blocks to render.         |
| `overlay`   | `boolean`       | No       | `false` | When true, renders the page in a full-screen overlay with a close button. |
| `help`      | `HelpData`      | No       |         | Contextual help content shown in the ContextAside panel.                  |
| `inspector` | `InspectorData` | No       |         | Inspector side-panel configuration (endpoint URL and width).              |

## Registration Functions {#registration}

Functions for populating the shell, layout, and block registries. Call `registerDefaults()` once at app startup to register all built-in components.

### registerDefaults()

```ts
function registerDefaults(): void
```

Registers all built-in shells, layouts, and block types. Idempotent — safe to call multiple times.

::: warning IIFE consumers
WordPress and other IIFE consumers should NOT call `registerDefaults()`. It pulls in lazy-loaded blocks (FlowEditor, FormBuilder, etc.) that include heavy dependencies (@xyflow/react, @dnd-kit). With `inlineDynamicImports: true`, these end up in the bundle even if unused. Use [selective registration](#selective-registration) instead.
:::

### registerShell(key, component)

```ts
function registerShell(key: Shell, component: ComponentType<ShellProps>): void
```

Register a custom shell component for a given shell key. Overrides the default if the key already exists.

| Argument    | Type                                 | Description                                                                       |
|-------------|--------------------------------------|-----------------------------------------------------------------------------------|
| `key`       | `'product' \| 'immersive' \| string` | Shell identifier matching the contract shell field. Extensible via `string & {}`. |
| `component` | `ComponentType<ShellProps>`          | React component that receives `{ children }` and renders the shell chrome.        |

### registerLayout(key, component)

```ts
function registerLayout(key: string, component: ComponentType<LayoutProps>): void
```

Register a custom layout component for a given template key.

| Argument    | Type                         | Description                                                 |
|-------------|------------------------------|-------------------------------------------------------------|
| `key`       | `string`                     | Layout template key (e.g. 'stack', 'sidebar', 'dashboard'). |
| `component` | `ComponentType<LayoutProps>` | React component receiving `{ layout, renderBlock }`.        |

### registerBlock(key, component)

```ts
function registerBlock<TData>(key: string, component: ComponentType<BlockProps<TData>>): void
```

Register a custom block component for a given block type key.

| Argument    | Type                               | Description                                            |
|-------------|------------------------------------|--------------------------------------------------------|
| `key`       | `string`                           | Block type key (e.g. 'dense_table', 'metric_card').    |
| `component` | `ComponentType<BlockProps<TData>>` | React component receiving `{ block }` with typed data. |

### Selective registration {#selective-registration}

For IIFE consumers, import and register only the components you need:

```tsx
import {
  registerShell, registerLayout, registerBlock,
  ProductShell, StackLayout, SidebarLayout, DashboardLayout,
  DenseTableBlock, MetricCardBlock, EmptyStateBlock,
} from '@middag-io/react';

registerShell('product', ProductShell);
registerLayout('stack', StackLayout);
registerLayout('sidebar', SidebarLayout);
registerLayout('dashboard', DashboardLayout);
registerBlock('dense_table', DenseTableBlock);
registerBlock('metric_card', MetricCardBlock);
registerBlock('empty_state', EmptyStateBlock);
```

Standard blocks, shells, and layouts are exported from the barrel. Heavy blocks (condition_tree, sentence_builder, flow_editor, form_builder) and form_panel are not exported from the barrel to avoid bundling their heavy dependencies. Import them from `@middag-io/react/blocks/*` if needed.

### Package Export Paths {#export-paths}

| Import path                     | Content                                                                                                                           |
|---------------------------------|-----------------------------------------------------------------------------------------------------------------------------------|
| `@middag-io/react`              | Barrel: types, ContractPage, registries, shells, layouts, the standard Community blocks, providers, MIDDAGThemeProvider, HostSlot |
| `@middag-io/react/style.css`    | CSS bundle (tokens + theme bridge + Tailwind utilities)                                                                           |
| `@middag-io/react/theme.css`    | Source CSS for consumers with their own Tailwind setup                                                                            |
| `@middag-io/react/themes/*.css` | Per-theme CSS (classic, enterprise, soft, midnight)                                                                               |
| `@middag-io/react/reui/*`       | ReUI primitives (pre-built ESM + `.d.ts`; extensionless specifiers, e.g. `reui/button`)                                           |
| `@middag-io/react/blocks/*`     | Block components (source .tsx)                                                                                                    |
| `@middag-io/react/schemas/*`    | Public JSON Schemas (wire contracts + discovery — the 11 files from `docs/public/schemas/`), e.g. `schemas/page-contract.json`    |
| `@middag-io/react/mock`         | Mock SPA extensible (GitHub Packages only)                                                                                        |

## Shell Components {#shells}

Built-in shells available for selective registration:

| Export           | Shell key   | Description                                                                                                                    |
|------------------|-------------|--------------------------------------------------------------------------------------------------------------------------------|
| `ProductShell`   | `product`   | Full shell with offcanvas sidebar, page header, breadcrumbs, floating controls, host header detection, optional admin tab bar. |
| `ImmersiveShell` | `immersive` | Full-screen, no sidebar. Slim top bar with close button. Designed for wizards, flow editors, onboarding.                       |

The `ProductShell` provides:

- Offcanvas collapsible sidebar with navigation
- SidebarFooter with collapse button + AppearanceToggle
- Floating expand + dark mode controls when sidebar is hidden
- Host header height detection (Moodle navbar, WP admin bar)
- Optional admin tab bar (rendered when `admin_tabs` shared prop is present)
- Zero padding on the `<main>` content area (layouts control all spacing)

## Lazy Block Loading {#lazy-blocks}

### LazyBlock

Wrapper that auto-fetches block data via Inertia partial reload when the block mounts.

```tsx
import { LazyBlock, isLazyBlock } from '@middag-io/react';
```

| Export        | Type                                  | Description                                                                   |
|---------------|---------------------------------------|-------------------------------------------------------------------------------|
| `LazyBlock`   | `React.FC<LazyBlockProps>`            | Renders a loading skeleton, triggers `router.reload`, then renders the block. |
| `isLazyBlock` | `(block: BlockDescriptor) => boolean` | Returns true if `block.meta.lazyProp` is a string.                            |

Lazy loading works automatically with ContractPage and TabbedPanelBlock. Set `meta.lazyProp` on a block descriptor and send a corresponding null Inertia prop from the backend. See [Blocks Guide](/guides/blocks#lazy-loading) for details.

## Registries {#registries}

Six registries are `Map` instances that store the mapping from contract keys to React components. Populated by `registerDefaults()` or individual `register*` calls.

| Registry         | Type                                      | Built-in entries                                                    |
|------------------|-------------------------------------------|---------------------------------------------------------------------|
| `shellRegistry`  | `Map<Shell, ComponentType<ShellProps>>`   | product, immersive                                                  |
| `layoutRegistry` | `Map<string, ComponentType<LayoutProps>>` | stack, sidebar, dashboard, wizard                                   |
| `blockRegistry`  | `Map<string, ComponentType<BlockProps>>`  | All built-in block types (see [Block Reference](/reference/blocks)) |

### Field Registry {#field-registry}

Maps form field component type strings to React field input components. Used internally by FormPanelBlock to resolve the correct input for each `FormFieldNode.component` value.

```tsx
import { registerFieldComponent, resolveFieldComponent } from '@middag-io/react';
import type { FieldComponentProps } from '@middag-io/react';
```

| Export                   | Type                                                                    | Description                              |
|--------------------------|-------------------------------------------------------------------------|------------------------------------------|
| `registerFieldComponent` | `(type: string, component: ComponentType<FieldComponentProps>) => void` | Register a custom field input component. |
| `resolveFieldComponent`  | `(type: string) => ComponentType<FieldComponentProps> \| undefined`     | Look up a field component by type key.   |

### Icon Registry {#icon-registry}

Maps icon names (kebab-case) and navigation entity types to SVG icon elements. Used by navigation, blocks, actions, and anywhere icons are resolved by name.

```tsx
import { registerIcon, resolveIcon, registerEntityIcon, resolveEntityIcon } from '@middag-io/react';
```

| Export               | Type                                                  | Description                                                  |
|----------------------|-------------------------------------------------------|--------------------------------------------------------------|
| `registerIcon`       | `(name: string, icon: IconSvgElement) => void`        | Register an icon by kebab-case name (e.g. "graduation-cap"). |
| `resolveIcon`        | `(name: string) => IconSvgElement \| undefined`       | Look up an icon by name.                                     |
| `registerEntityIcon` | `(entityType: string, icon: IconSvgElement) => void`  | Register an icon for a navigation entity type.               |
| `resolveEntityIcon`  | `(entityType: string) => IconSvgElement \| undefined` | Look up an entity type icon.                                 |

Built-in: 66 named icons + 11 entity type icons registered by `registerDefaultIcons()`.

### Cell Registry {#cell-registry}

Maps DataTable column variant strings to custom cell renderer components. Extends DenseTable with new column visualizations.

```tsx
import { registerCellRenderer, resolveCellRenderer } from '@middag-io/react';
import type { CellRendererProps } from '@middag-io/react';
```

| Export                 | Type                                                                  | Description                             |
|------------------------|-----------------------------------------------------------------------|-----------------------------------------|
| `registerCellRenderer` | `(type: string, component: ComponentType<CellRendererProps>) => void` | Register a custom cell renderer.        |
| `resolveCellRenderer`  | `(type: string) => ComponentType<CellRendererProps> \| undefined`     | Look up a cell renderer by variant key. |

Built-in variants: text, status, badge, boolean, timestamp, link, rich_status, html, link_group, annotated.

## Providers {#providers}

### I18nProvider

```tsx
<I18nProvider asyncResolver?={resolver} overrides?={strings}>{children}</I18nProvider>
```

Translation provider. Reads pre-loaded strings from Inertia shared props (`theme.strings`). Optionally accepts an async resolver for keys not pre-loaded by the server, and/or a static overrides map.

Lookup chain: server strings > overrides > async strings > `LIB_UI_DEFAULTS` > key itself.

| Prop            | Type                     | Required | Description                                                                                                                         |
|-----------------|--------------------------|----------|-------------------------------------------------------------------------------------------------------------------------------------|
| `children`      | `ReactNode`              | Yes      | Child components that can access translation functions.                                                                             |
| `asyncResolver` | `AsyncStringResolver`    | No       | Optional async function to resolve translation keys not in the pre-loaded strings.                                                  |
| `overrides`     | `Record<string, string>` | No       | Client-side string overrides merged into the lookup chain. Useful for hosts that inject translations directly (e.g. `ptBR` locale). |

See [Providers Guide](/guides/providers) and [i18n Guide](/guides/i18n) for details.

### useTranslation()

```ts
function useTranslation(): { t, tAsync }
```

| Return   | Type                                                   | Description                                                                |
|----------|--------------------------------------------------------|----------------------------------------------------------------------------|
| `t`      | `(key: string) => string`                              | Synchronous lookup. Returns the key itself if not yet loaded.              |
| `tAsync` | `(key: string, component?: string) => Promise<string>` | Async lookup using the injected resolver. Falls back to returning the key. |

## Theme Functions {#theme}

Appearance management with host detection and manual override. Three-tier resolution: manual > host (Moodle/WP) > OS.

| Function              | Signature                                 | Description                                                                                     |
|-----------------------|-------------------------------------------|-------------------------------------------------------------------------------------------------|
| `getStoredAppearance` | `() => Appearance`                        | Read stored preference from localStorage. Returns 'system' if none.                             |
| `setAppearance`       | `(pref: Appearance) => void`              | Persist preference, resolve effective theme, apply to DOM.                                      |
| `cycleAppearance`     | `() => Appearance`                        | Cycle: system > light > dark > system. Persists and applies.                                    |
| `getEffectiveTheme`   | `(pref: Appearance) => 'light' \| 'dark'` | Resolve 'system' to concrete theme via host detection + OS.                                     |
| `applyTheme`          | `(theme: EffectiveTheme) => void`         | Apply resolved theme to DOM (data-theme on .middag-root, class on html).                        |
| `toggleDir`           | `() => 'ltr' \| 'rtl'`                    | Toggle document direction. Persists in localStorage.                                            |
| `initDir`             | `() => void`                              | Restore persisted direction on page load.                                                       |
| `onSystemThemeChange` | `(cb?: () => void) => () => void`         | Listen for OS theme changes. Only reacts when preference is 'system'. Returns cleanup function. |

See [Theme Guide](/guides/theme) for usage examples.

## Hooks {#hooks}

### useIsDark()

```ts
function useIsDark(): boolean
```

Returns true when the effective theme is 'dark'. Reacts to theme changes via the `data-theme` attribute on `.middag-root` elements.

```tsx
import { useIsDark } from '@middag-io/react';

function Logo() {
    const isDark = useIsDark();
    return <img src={isDark ? '/logo-white.svg' : '/logo-dark.svg'} alt="Logo" />;
}
```

## Types: Page Contract {#types-page-contract}

Core types for the contract-driven page system. The backend sends `PageContract` via Inertia props.

```ts
interface PageContract {
    version: '1';
    shell: 'product' | 'immersive' | (string & {});
    page: PageMeta;
    layout: LayoutDescriptor;
    resources?: PageResources;
}

interface PageMeta {
    key: string;
    title: string;
    subtitle?: string;
    icon?: string;
    badge?: PageBadge;
    favoritable?: boolean;
    breadcrumbs?: Breadcrumb[];
    actions?: PageAction[];
    filterTabs?: PageFilterTab[];
    activeFilterTab?: string;
}

interface BlockDescriptor<TData = Record<string, unknown>> {
    type: string;       // block type key (e.g. 'dense_table')
    key: string;        // unique key within the page
    data: TData;        // typed data payload (empty {} for lazy blocks)
    variant?: string;
    title?: string;
    subtitle?: string;
    actions?: PageAction[];
    meta?: Record<string, unknown>;
    // Reserved meta keys:
    //   fullBleed: boolean -- skip horizontal padding (edge-to-edge)
    //   lazyProp: string   -- Inertia prop key for lazy-loaded data
    //   loading: boolean   -- show loading skeleton
}

interface LayoutDescriptor {
    template: 'stack' | 'sidebar' | 'dashboard' | 'wizard' | (string & {});
    regions: Record<string, BlockDescriptor[]>;
    meta?: Record<string, unknown>;
}

interface HelpData {
    title: string;
    description: string;
    sections?: HelpSection[];
    tips?: HelpTip[];
    shortcuts?: HelpShortcut[];
    learnMore?: string;
}

interface ContractPageProps {
    contract: PageContract;
    overlay?: boolean;
    help?: HelpData;
    inspector?: InspectorData;
}
```

## Types: SharedProps {#types-shared-props}

Typed Inertia shared props sent on every request.

```ts
interface SharedProps {
    navigation: NavigationTreePayload;
    auth: SharedPropsAuth;
    theme: SharedPropsTheme;
    flash?: SharedPropsFlash;
    locale: string;       // e.g. 'pt-BR', 'en'
    version: string;      // e.g. '5.0.0'
    scope?: Record<string, unknown>;
    [key: string]: unknown;
}

interface SharedPropsAuth {
    id: number;
    name: string;
    email: string;
    avatarUrl?: string;
    capabilities: string[];
}

interface SharedPropsTheme {
    strings?: Record<string, string>;
    appearance?: 'system' | 'light' | 'dark';
    brandColor?: string;
    inherit?: boolean;
}
```

## Types: Navigation {#types-navigation}

Navigation contract types. The unified tree model is the single supported shape (pre-1.0: the legacy sections-based `NavigationPayload` was removed).

```ts
interface NavigationTreePayload {
    tree: NavigationNode[];
    activeKey: string;
    drilldownStack?: string[];
    footer: NavigationNode[];
}

interface NavigationNode {
    key: string;
    label: string;
    icon?: string;
    entityType?: NavigationEntityType;
    href?: string;
    badge?: string | number;
    badgeVariant?: 'count' | 'alert';
    active?: boolean;
    drilldown?: boolean;
    collapsible?: boolean;
    defaultOpen?: boolean;
    statusColor?: string;
    children?: NavigationNode[];
}
```

See [Navigation Guide](/guides/navigation) for usage details.

## Types: Registry {#types-registry}

Props interfaces for registered components.

```ts
// Shell component receives children to render inside the chrome
type ShellProps = { children: ReactNode };

// Layout component receives the layout descriptor and a render function
type LayoutProps = {
    layout: LayoutDescriptor;
    renderBlock: (block: BlockDescriptor) => ReactElement | null;
};

// Block component receives the full block descriptor with typed data
type BlockProps<TData = Record<string, unknown>> = {
    block: BlockDescriptor<TData>;
};
```

## Types: Block Data {#types-block-data}

Data contracts for the registered block types. Each block component receives a `BlockDescriptor<TData>` where TData is one of these interfaces.

| Type Key            | Data Interface            | Description                                                                            |
|---------------------|---------------------------|----------------------------------------------------------------------------------------|
| `dense_table`       | DenseTableBlockData       | Full-featured table with sort, filter, pagination, bulk/row actions, density toggle.   |
| `metric_card`       | MetricCardBlockData       | KPI card with value, delta, icon, optional link.                                       |
| `status_strip`      | StatusStripBlockData      | Horizontal health indicators with score dots and key/value pairs.                      |
| `detail_panel`      | DetailPanelBlockData      | Sections of label/value fields (text, status, timestamp, link, code, email).           |
| `activity_timeline` | ActivityTimelineBlockData | Grouped timeline entries with actor, action, icon, color, timestamp.                   |
| `card_grid`         | CardGridBlockData         | Card-based grid. Variants: default, store, connector.                                  |
| `markdown_panel`    | MarkdownPanelBlockData    | Sanitized markdown rendering with syntax highlight and copy button.                    |
| `link_list`         | LinkListBlockData         | Vertical list of links with icon, label, description.                                  |
| `tabbed_panel`      | TabbedPanelBlockData      | Tab container that nests other blocks. Each tab has key, label, and blocks array.      |
| `empty_state`       | EmptyStateBlockData       | Empty/error/first-use placeholder. Variants: first-use, no-results, error, permission. |
| `form_panel`        | FormPanelBlockData        | Schema-driven form with sections, groups, conditional fields, dirty tracking.          |
| `action_grid`       | ActionGridBlockData       | Grid of action cards with icon, title, description, execute button.                    |
| `condition_tree`    | ConditionTreeBlockData    | AND/OR tree for condition rules with nesting.                                          |
| `sentence_builder`  | SentenceBuilderBlockData  | Natural language rule builder for audience segments.                                   |
| `flow_editor`       | FlowEditorBlockData       | Canvas with draggable nodes and edges for workflow editing.                            |
| `form_builder`      | FormBuilderBlockData      | Drag-and-drop form field builder.                                                      |
| `workflow_progress` | WorkflowProgressBlockData | Horizontal stepper showing linear workflow states (past/current/future).               |
| `chart_panel`       | ChartPanelBlockData       | Multi-series chart (bar, line, area, pie) via Recharts. Lazy-loaded.                   |
| `kanban_board`      | KanbanBoardBlockData      | Drag-and-drop kanban board with columns and cards. Lazy-loaded.                        |

See [Block Catalog](/reference/blocks) for data shape examples.

## Types: Theme {#types-theme}

```ts
type Appearance = 'system' | 'light' | 'dark';
type EffectiveTheme = 'light' | 'dark';
type AsyncStringResolver = (key: string, component?: string) => Promise<string>;
```

## Other Page Types {#other-types}

```ts
type Shell = 'product' | 'immersive' | (string & {});

type LayoutTemplate = 'stack' | 'sidebar' | 'dashboard'
    | 'wizard' | (string & {});

interface PageFilterTab {
    key: string; label: string; badge?: number | string;
}

interface Breadcrumb {
    label: string; href?: string; external?: boolean;
}

interface PageAction {
    id: string; label: string; intent: ActionIntent;
    href?: string; method?: ActionMethod; icon?: string;
    confirmation?: ActionConfirmation; disabled?: boolean;
}

interface InspectorData { endpoint: string; width: number; }

interface HelpSection { title: string; body: string; }

interface HelpTip { icon?: string; text: string; }

interface HelpShortcut { keys: string; action: string; }
```

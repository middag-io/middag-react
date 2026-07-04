# Page Contracts

A PageContract is a JSON object that fully describes a page. The backend builds it; the frontend renders it.

## Contract Anatomy {#anatomy}

Every contract follows the same hierarchical structure:

```
PageContract
 +-- version: "1"
 +-- shell: "product" | "immersive"
 +-- page
 |    +-- key, title, breadcrumbs, actions, filters
 +-- layout
      +-- template: "stack" | "sidebar" | "dashboard" | "wizard"
      +-- regions
           +-- content: [ BlockDescriptor, ... ]
           +-- main:    [ BlockDescriptor, ... ]
           +-- aside:   [ BlockDescriptor, ... ]
           +-- header:  [ BlockDescriptor, ... ]

BlockDescriptor
 +-- type: "dense_table" | "form_panel" | ...
 +-- key:  unique string
 +-- data: { ... block-specific payload }
 +-- meta: { fullBleed?: boolean, lazyProp?: string, ... }
```

::: info Immutable at render time
The contract is read-only once it reaches the frontend. All mutations happen on the backend, which sends a new contract via Inertia partial reload.
:::

## Shells {#shells}

The shell wraps the entire page and provides chrome (navigation, header, footer):

| Shell       | Description                                    | Chrome                                                       |
|-------------|------------------------------------------------|--------------------------------------------------------------|
| `product`   | Full application shell with sidebar navigation | Offcanvas sidebar + top header + breadcrumbs + optional tabs |
| `immersive` | Distraction-free shell for focused tasks       | Minimal top bar with close button                            |

The `product` shell provides zero padding on its content area. Layouts and blocks control all spacing (see [Layout Templates](/reference/layouts#padding-model)).

When the Inertia shared prop `admin_tabs` is present, the `product` shell renders a tab bar between the page header and content area.

## Layouts {#layouts}

The layout defines how regions are arranged inside the shell content area:

| Template    | Description                              | Regions                              |
|-------------|------------------------------------------|--------------------------------------|
| `stack`     | Single column, blocks stacked vertically | content, header?, footer?            |
| `sidebar`   | Two-column layout (main + aside panel)   | main, aside, header?                 |
| `dashboard` | Grid with metrics row and body content   | metrics, header?, content, aside?    |
| `wizard`    | Multi-step form with progress indicator  | content (+ meta.steps, meta.actions) |

See [Layout Templates](/reference/layouts) for detailed region documentation and the padding model.

## Blocks Overview {#blocks}

Blocks are the building blocks of every page. Each block type has a specific data shape. See the [Block Catalog](/reference/blocks) for full details.

| Block Type          | Category      | Description                                      |
|---------------------|---------------|--------------------------------------------------|
| `dense_table`       | Data Display  | Sortable, filterable data table with row actions |
| `detail_panel`      | Data Display  | Key-value detail view with sections              |
| `card_grid`         | Data Display  | Grid of cards with status, actions, and metadata |
| `link_list`         | Data Display  | Simple list of labeled links with optional icons |
| `status_strip`      | Data Display  | Horizontal strip of status/metric badges         |
| `activity_timeline` | Data Display  | Chronological list of events                     |
| `form_panel`        | Forms         | Dynamic form with field groups and validation    |
| `form_builder`      | Forms         | Drag-and-drop form field designer                |
| `sentence_builder`  | Forms         | Natural language rule composer                   |
| `condition_tree`    | Forms         | Nested AND/OR condition tree editor              |
| `empty_state`       | Content       | Placeholder for empty or first-use states        |
| `markdown_panel`    | Content       | Rendered markdown content block                  |
| `tabbed_panel`      | Content       | Tabbed container for nested blocks               |
| `action_grid`       | Content       | Grid of action cards (quick actions / shortcuts) |
| `workflow_progress` | Data Display  | Linear workflow state indicator with timestamps  |
| `metric_card`       | Visualization | Single KPI with trend indicator                  |
| `chart_panel`       | Visualization | Multi-series chart (bar, line, area, pie)        |
| `flow_editor`       | Visualization | Visual workflow/node graph editor                |
| `kanban_board`      | Interactive   | Drag-and-drop kanban board with columns          |

## Rendering Flow {#rendering}

The journey from backend to rendered page:

```
1. Backend (PHP)        Build PageContract array/object
                           |
2. Inertia              Serialize to JSON, send as page props
                           |
3. ContractPage         Receive contract prop
                           |
4. Shell Registry       Resolve shell component (product/immersive)
                           |
5. Layout Registry      Resolve layout component (stack/sidebar/...)
                           |
6. Block Registry       For each BlockDescriptor in each region,
                        resolve the block component by type
                           |
7. React Render         Shell > Layout > Blocks rendered as tree
```

::: info Custom registrations
The registries are populated by `registerDefaults()`. You can also register custom shells, layouts, or blocks for extension-specific UIs.
:::

## TypeScript Types

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

interface LayoutDescriptor {
    template: 'stack' | 'sidebar' | 'dashboard' | 'wizard' | (string & {});
    regions: Record<string, BlockDescriptor[]>;
    meta?: Record<string, unknown>;
}

interface BlockDescriptor<TData = Record<string, unknown>> {
    type: string;       // block type key (e.g. 'dense_table')
    key: string;        // unique key within the page
    data: TData;        // typed data payload
    variant?: string;
    title?: string;
    subtitle?: string;
    actions?: PageAction[];
    meta?: Record<string, unknown>;
    // Reserved meta keys:
    //   fullBleed: boolean  -- skip horizontal padding (edge-to-edge)
    //   lazyProp: string    -- Inertia prop key for lazy-loaded data
    //   loading: boolean    -- show loading skeleton
}
```

See [API Reference](/reference/api) for complete type definitions.

## Action Hierarchy {#action-hierarchy}

Page and block actions use a unified type hierarchy (SOLID principles):

| Type                | Purpose                                                         |
|---------------------|-----------------------------------------------------------------|
| `ActionBase`        | Base: id, label, icon?, intent?, disabled?                      |
| `ExecutableAction`  | POST/PUT/DELETE with optional confirmation (bulk, detail, grid) |
| `ConditionalAction` | Row-level with visible_when/disabled_when/loading_when          |
| `PageAction`        | Page-level actions (extends ActionBase)                         |

```ts
// Page-level actions (header buttons)
actions?: PageAction[];

// Row-level actions (DataTable rows)
rowActions?: ConditionalAction[];

// Bulk actions (DataTable multi-select)
bulkActions?: ExecutableAction[];
```

`ExecutableAction` extends `ActionBase` with `href`, `method`, and `confirmation?: ActionConfirmation`. `ConditionalAction` extends `ExecutableAction` with `visible_when`, `disabled_when`, and `loading_when` callback props.

# Blocks Guide

Extend the UI by creating custom block types that the backend can reference in page contracts.

## Block Architecture

Blocks are React components that receive a typed `BlockProps<TData>` prop. Each block is registered via `registerBlock(type, Component)` so the rendering engine can resolve it at runtime. The backend sends a `BlockDescriptor` with a matching `type` field, and the block receives the full descriptor including `data`, `key`, `title`, `actions`, and `meta`.

```tsx
// blocks/MyWidgetBlock.tsx
import type { BlockProps } from '@middag-io/react';

interface MyWidgetData {
    label: string;
    value: number;
    chart: { x: number; y: number }[];
}

export function MyWidgetBlock({ block }: BlockProps<MyWidgetData>) {
    const { label, value, chart } = block.data;
    return (
        <div className="rounded-lg border p-4">
            <h3>{label}</h3>
            <span className="text-2xl font-bold">{value}</span>
            {/* render chart... */}
        </div>
    );
}
```

## Registration

Register your block once at your app entry point, after calling `registerDefaults()`. The type string must match what the backend sends in the contract.

```tsx
// main.tsx
import { registerBlock } from '@middag-io/react';
import { MyWidgetBlock } from './blocks/MyWidgetBlock';

registerBlock('my_widget', MyWidgetBlock);
```

## Backend Contract {#backend-contract}

The backend includes the block in a page contract by specifying the matching `type` and providing the `data` payload:

```php
$block = [
    'type' => 'my_widget',
    'key' => 'sales-widget',
    'data' => [
        'label' => 'Sales Today',
        'value' => 42,
        'chart' => [...],
    ],
];
```

## Block Props Reference {#block-props-reference}

Every block receives a `block` object with the following properties:

| Prop            | Type                      | Required | Description                                                            |
|-----------------|---------------------------|----------|------------------------------------------------------------------------|
| `block.type`    | `string`                  | Yes      | Block type identifier used to resolve the component from the registry. |
| `block.key`     | `string`                  | Yes      | Unique key for this block instance within the page.                    |
| `block.data`    | `TData`                   | Yes      | Typed data payload specific to this block type.                        |
| `block.title`   | `string`                  | No       | Optional display title rendered by the layout above the block.         |
| `block.actions` | `Action[]`                | No       | Optional array of action buttons associated with the block.            |
| `block.meta`    | `Record<string, unknown>` | No       | Arbitrary metadata for presentation hints (polling, fullBleed, etc.).  |
| `block.variant` | `string`                  | No       | Optional visual variant for the block (e.g. "compact", "card").        |

## Tips

::: tip Keep blocks stateless
Data comes from the contract, not from internal state. If a block needs to change data, send a request to the backend and let it return an updated contract.
:::

::: tip Use block.meta for presentation hints
The `meta` field is ideal for signaling rendering preferences like `fullBleed`, polling intervals, or custom layout options without polluting the typed `data` payload.
:::

::: warning Block type names must be globally unique
Since all blocks share a single registry, prefix your type names with your plugin name to avoid collisions: `myplugin_widget` instead of just `widget`.
:::

## Lazy Loading {#lazy-loading}

Blocks can defer their data until they mount. This is useful for tabbed pages where you don't want to load all tab data upfront.

### How it works

1. The backend sends a block with `data: {}` (empty placeholder) and `meta.lazyProp` pointing to a top-level Inertia prop:

```php
return Inertia::render('Contract:Entitlements/Show', [
    'contract' => $pageContract,  // block has meta.lazyProp = 'invoices'
    'invoices' => Inertia::lazy(fn () => $this->getInvoices($id)),
]);
```

2. When the block mounts, the `LazyBlock` wrapper detects `meta.lazyProp`, reads `usePage().props.invoices`, and if null, calls `router.reload({ only: ['invoices'] })`.

3. The backend returns the data, Inertia merges it into props, and the block re-renders with the loaded data.

### Block descriptor example

```ts
{
  type: 'dense_table',
  key: 'invoices-table',
  data: {},                         // placeholder -- LazyBlock ignores this
  meta: { lazyProp: 'invoices' },   // reads from usePage().props.invoices
}
```

### Works with TabbedPanel

Radix Tabs unmounts inactive tab content by default. Combined with lazy loading, only the active tab's blocks fetch data. Switching tabs mounts new blocks, triggering their fetches automatically.

```ts
{
  type: 'tabbed_panel',
  key: 'entity-tabs',
  data: {
    tabs: [
      {
        key: 'overview',
        label: 'Overview',
        blocks: [
          { type: 'detail_panel', key: 'details', data: { sections: [...] } },
        ],
      },
      {
        key: 'invoices',
        label: 'Invoices',
        blocks: [
          { type: 'dense_table', key: 'inv-table', data: {}, meta: { lazyProp: 'invoices' } },
        ],
      },
    ],
  },
}
```

## Exported Components {#exported-components}

The standard Community blocks (registered by registerDefaults()) are exported from the barrel for selective registration:

```tsx
import { DenseTableBlock, MetricCardBlock, EmptyStateBlock } from '@middag-io/react';
```

Heavy blocks (condition_tree, sentence_builder, flow_editor, form_builder, form_panel, chart_panel, kanban_board) are available via deep import:

```tsx
import { FlowEditorBlock } from '@middag-io/react/blocks/FlowEditorBlock.tsx';
```

## ReUI Primitives {#reui-primitives}

Consumers building custom components can import ReUI primitives:

```tsx
import { Button } from '@middag-io/react/reui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@middag-io/react/reui/tabs';
```

See [Block Catalog](/reference/blocks) for the built-in block types with data shape examples.

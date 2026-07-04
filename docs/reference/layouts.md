# Layout Templates

Layouts define how block regions are arranged inside the shell content area. The `template` field in the `LayoutDescriptor` selects which layout to use.

## Architecture

All layouts share a common foundation: the **BlockRegion** component. BlockRegion handles per-block horizontal padding (`px-6` by default), respects `meta.fullBleed` on individual blocks, and provides consistent spacing between blocks via `gap`.

Built-in layouts are **presets** that compose BlockRegion in different arrangements. Custom layouts can use BlockRegion the same way, or ignore it entirely for full control.

```
BlockRegion (shared utility)
  - Per-block horizontal padding (px-6)
  - Skips padding when block has meta.fullBleed: true
  - Consistent gap between blocks (space-y-4)

StackLayout     = BlockRegion(header?) + BlockRegion(content) + BlockRegion(footer?)
SidebarLayout   = BlockRegion(header?) + grid[ BlockRegion(main) | aside ]
DashboardLayout = StatRow(metrics) + BlockRegion(content) + BlockRegion(aside?)
WizardLayout    = StepBar + BlockRegion(content) + ActionsBar
```

## Padding Model

Padding is **per-block, per-region** — not global. The shell provides zero padding on its content area. Each layout applies vertical padding (`py-6`) and uses BlockRegion for horizontal per-block padding:

- **Default:** each block gets `px-6` horizontal padding.
- **Full bleed:** blocks with `meta.fullBleed: true` skip horizontal padding (edge-to-edge rendering).
- **Grid regions:** some regions (e.g., DashboardLayout metrics) render blocks without per-block padding because they use a grid where blocks fill cells.

```ts
// Example: DenseTable with full bleed in a stack layout
{
    template: 'stack',
    regions: {
        content: [
            { type: 'status_strip', key: 'status', data: { ... } },
            { type: 'dense_table', key: 'users', data: { ... }, meta: { fullBleed: true } },
        ],
    },
}
// Result: status_strip has px-6 padding, dense_table spans edge-to-edge
```

## Overview

| Template    | Regions                              | Use Case                                 |
|-------------|--------------------------------------|------------------------------------------|
| `stack`     | content, header?, footer?            | Lists, tables, single-column pages       |
| `sidebar`   | main, aside, header?                 | Detail pages with sidebar panel (320px)  |
| `dashboard` | metrics, header?, content, aside?    | KPI overview with metrics row            |
| `wizard`    | content (+ meta.steps, meta.actions) | Multi-step forms with progress indicator |

## stack

Single column, blocks stacked vertically. The simplest and most common layout.

**Regions:** `content` (required), `header?`, `footer?`

```ts
{
    template: 'stack',
    regions: {
        content: [
            { type: 'status_strip', key: 'status', data: { ... } },
            { type: 'dense_table', key: 'users', data: { ... }, meta: { fullBleed: true } },
        ],
    },
}
```

**Use cases:** User lists, settings pages, single-focus views, form pages.

Blocks receive `px-6` horizontal padding by default. Set `meta.fullBleed: true` on a block to render it edge-to-edge (useful for `dense_table`).

## sidebar

Two-column layout with a main content area and an aside panel.

**Regions:** `main` (required), `aside` (required), `header?`

```ts
{
    template: 'sidebar',
    regions: {
        main: [
            { type: 'detail_panel', key: 'details', data: { ... } },
            { type: 'activity_timeline', key: 'timeline', data: { ... } },
        ],
        aside: [
            { type: 'link_list', key: 'related', data: { ... } },
            { type: 'metric_card', key: 'stats', data: { ... } },
        ],
    },
}
```

**Use cases:** Entity detail pages, profile pages, connector settings, documentation with ToC.

The aside panel is 320px wide with a left border and subtle background (`border-l border-border bg-muted/30`), styled via semantic tokens so themes can override it. It collapses below the main content on mobile.

When the `header` region is present, it renders as a full-width row above the two columns:

```ts
{
    template: 'sidebar',
    regions: {
        header: [
            { type: 'status_strip', key: 'status', data: { ... } },
        ],
        main: [
            { type: 'dense_table', key: 'list', data: { ... }, meta: { fullBleed: true } },
        ],
        aside: [
            { type: 'detail_panel', key: 'selected', data: { ... } },
        ],
    },
}
```

## dashboard

Grid layout with a metrics row at the top and a body area for content blocks.

**Regions:** `metrics` (metric cards row), `header?`, `content`, `aside?`

```ts
{
    template: 'dashboard',
    regions: {
        metrics: [
            { type: 'metric_card', key: 'users', data: { ... } },
            { type: 'metric_card', key: 'courses', data: { ... } },
            { type: 'metric_card', key: 'completions', data: { ... } },
            { type: 'metric_card', key: 'revenue', data: { ... } },
        ],
        content: [
            { type: 'dense_table', key: 'recent', data: { ... } },
            { type: 'activity_timeline', key: 'activity', data: { ... } },
        ],
    },
}
```

**Use cases:** Dashboard overview pages, analytics summaries, admin home.

The `metrics` region renders as a responsive 4-column grid via `StatRow`. Blocks in this region do **not** receive per-block padding (they fill grid cells directly). The `content` and `aside` regions use standard BlockRegion padding.

## wizard

Multi-step form layout with a progress indicator and action buttons.

**Regions:** `content` (blocks for the current step)

**Meta:** `steps` (step definitions), `actions` (navigation buttons)

```ts
{
    template: 'wizard',
    regions: {
        content: [
            { type: 'form_panel', key: 'step1-form', data: { ... } },
        ],
    },
    meta: {
        steps: [
            { key: 'basic', label: 'Basic Information', status: 'current' },
            { key: 'config', label: 'Configuration', status: 'upcoming' },
            { key: 'review', label: 'Review', status: 'upcoming' },
        ],
        actions: [
            { id: 'back', label: 'Back', intent: 'ghost', href: '/wizard/back' },
            { id: 'next', label: 'Next', intent: 'primary', href: '/wizard/next' },
        ],
    },
}
```

**Use cases:** Onboarding flows, multi-step configuration, setup wizards.

::: tip Pair with immersive shell
For focused wizard experiences, use `shell: 'immersive'` to remove sidebar and navigation chrome entirely. The wizard layout provides its own step indicator and action buttons.
:::

## Custom Layouts

Register custom layout components that compose `BlockRegion` for consistent padding behavior:

```tsx
import { registerLayout } from '@middag-io/react';
import type { LayoutProps } from '@middag-io/react';

function MyCustomLayout({ layout, renderBlock }: LayoutProps) {
    const main = layout.regions.main ?? [];
    const aside = layout.regions.aside ?? [];

    return (
        <div className="py-6 flex flex-col gap-5">
            <div className="grid grid-cols-3 gap-4 px-6">
                <div className="col-span-2 space-y-4">
                    {main.map(renderBlock)}
                </div>
                <div className="space-y-4">
                    {aside.map(renderBlock)}
                </div>
            </div>
        </div>
    );
}

registerLayout('my_custom', MyCustomLayout);
```

Then reference it in the contract:

```ts
{
    template: 'my_custom',
    regions: {
        main: [...],
        aside: [...],
    },
}
```

::: info BlockRegion
Custom layouts can import and use the `BlockRegion` component from `@middag-io/react` for automatic per-block padding with `fullBleed` support, or handle padding manually as shown above.
:::

# Navigation Guide

The navigation system receives a tree of nodes from the backend and renders the sidebar automatically. Nodes support badges, drilldown, collapsible groups, and status indicators.

## NavigationTreePayload {#tree-payload}

The backend sends a `NavigationTreePayload` as an Inertia shared prop. It contains a tree of `NavigationNode` objects, an active key, and optional footer items.

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

::: info Footer items
The `footer` array renders at the bottom of the sidebar, below the scrollable tree. Typical footer items are Help and Settings links.
:::

## Building Navigation from Backend {#backend-nav}

In PHP, build the navigation tree using the framework's navigation builder or construct the array directly:

```php
// In your extension's boot() method:
$nav = $this->container->get(navigation_registry::class);

$nav->group('main', 'Main', 'home', [
    $nav->link('dashboard', 'Dashboard', '/dashboard', 'layout-dashboard'),
    $nav->link('courses', 'Courses', '/courses', 'graduation-cap')
        ->badge(12)
        ->children([
            $nav->link('courses.active', 'Active', '/courses/active'),
            $nav->link('courses.archived', 'Archived', '/courses/archived'),
        ]),
]);

$nav->group('config', 'Configuration', 'settings', [
    $nav->link('connectors', 'Connectors', '/connectors', 'plug')
        ->drilldown()
        ->statusColor('var(--success)')
        ->children([
            $nav->link('connectors.list', 'All Connectors', '/connectors'),
            $nav->link('connectors.sap', 'SAP SF', '/connectors/sap-sf'),
        ]),
]);

// Footer
$nav->footer([
    $nav->link('help', 'Help', '#', 'help-circle'),
    $nav->link('settings', 'Settings', '/settings', 'settings-2'),
]);
```

## Active Key Resolution {#active-key}

The `resolveTreeActiveKey(pathname, tree)` function matches the current URL against node `href` values. It picks the longest matching href (most specific wins).

```ts
import { resolveTreeActiveKey } from '@middag-io/react';

// Given nodes with hrefs: /connectors, /connectors/sap-sf

resolveTreeActiveKey('/connectors', tree);
// => 'connectors' (exact match)

resolveTreeActiveKey('/connectors/123', tree);
// => 'connectors' (prefix match, /connectors is longest match)

resolveTreeActiveKey('/connectors/sap-sf', tree);
// => 'connectors.sap-sf' (exact match, more specific)

resolveTreeActiveKey('/unknown', tree);
// => 'dashboard' (fallback default)
```

::: tip Server-side resolution
In production, the backend resolves the active key and sends it in `activeKey`. The client-side function is primarily used in the mock build and as a fallback.
:::

## Navigation Node Properties {#node-properties}

| Property       | Type                 | Required | Default | Description                                                                            |
|----------------|----------------------|----------|---------|----------------------------------------------------------------------------------------|
| `key`          | string               | Yes      |         | Unique identifier. Used for active key matching and React keys.                        |
| `label`        | string               | Yes      |         | Localized display text.                                                                |
| `icon`         | string               | No       |         | Lucide icon name (kebab-case). E.g. "plug", "graduation-cap", "settings-2".            |
| `entityType`   | NavigationEntityType | No       |         | Auto-resolves icon if icon is not set. E.g. "connector" maps to "plug".                |
| `href`         | string               | No       |         | Navigation URL. Omit for non-navigable group nodes.                                    |
| `badge`        | string \| number     | No       |         | Badge value shown next to the label. E.g. 12, "new".                                   |
| `badgeVariant` | "count" \| "alert"   | No       | "count" | "count" renders muted text; "alert" renders a red pill.                                |
| `drilldown`    | boolean              | No       |         | When true, clicking replaces the sidebar with this node's children plus a back button. |
| `collapsible`  | boolean              | No       |         | When true, the group renders with a toggle to expand/collapse its children.            |
| `defaultOpen`  | boolean              | No       | false   | Whether a collapsible group starts expanded on first render.                           |
| `statusColor`  | string               | No       |         | CSS color for a status dot next to drilldown titles.                                   |
| `children`     | NavigationNode[]     | No       |         | Child nodes. Supports up to 3 levels of depth.                                         |

## Sidebar Rendering {#sidebar-rendering}

The `SidebarNav` component receives the navigation tree and renders it with the following rules:

- **3-level depth** — Level 1 (groups with icons), Level 2 (navigable items), Level 3 (leaf items). Deeper nesting is ignored.
- **Separator nodes** — nodes with a key ending in `_sep` render as horizontal dividers with their label as a section title.
- **Drilldown navigation** — nodes with `drilldown: true` push their children as a new sidebar level with a back button.
- **Active state** — the node matching `activeKey` gets highlighted styling. Its parent group auto-expands.
- **Badges** — `count` variant shows a muted number; `alert` variant shows a red pill.
- **Collapsed state** — when the sidebar is collapsed (icon-only mode), only Level 1 icons are shown. Hovering reveals a flyout with the full tree.

```ts
// A separator node in the tree:
{
    key: 'config.connectors._sep',
    label: 'Related',
    // No href -- renders as divider
}

// Followed by related links:
{
    key: 'config.connectors.rel-ig',
    label: 'Instance Groups',
    href: '/instance-groups?from=connectors',
    icon: 'layers',
}
```

::: info Footer items
Footer items (Help, Settings) are rendered at the bottom of the sidebar, pinned below the scrollable tree. They remain visible even when the tree overflows.
:::

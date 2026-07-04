# WordPress Integration

Integrate MIDDAG React UI into a WordPress admin plugin using Inertia.js and the host adapter system.

## Prerequisites

- **WordPress 6.x+** with admin access
- **PHP 8.2+** with Composer autoloading
- **Inertia.js WordPress adapter** — community package or custom integration
- **Node.js 20+** and npm for the frontend build

## Install {#install}

Navigate to your plugin's UI directory and install the package:

```bash
cd /path/to/wp-content/plugins/your-plugin/ui
npm install @middag-io/react
```

## Vite Config {#vite-config}

Configure Vite to output a manifest for WordPress asset enqueuing:

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: '../assets/dist',
        manifest: true,
    },
});
```

::: tip Asset enqueuing
Use the Vite manifest (`manifest.json`) to resolve hashed filenames when calling `wp_enqueue_script()` and `wp_enqueue_style()` in PHP.
:::

## Entry Point {#entry-point}

Create your app entry point. WordPress plugins typically build as IIFE (single JS file) via `wp_enqueue_script()`. Use **selective registration** instead of `registerDefaults()` to avoid bundling heavy dependencies.

```tsx
// main.tsx
import '@middag-io/react/style.css';
import './theme.css';  // ACCOUNT-specific token overrides

import {
  ContractPage, I18nProvider,
  registerShell, registerLayout, registerBlock,
  ImmersiveShell, StackLayout, SidebarLayout, DashboardLayout,
  DenseTableBlock, MetricCardBlock, EmptyStateBlock,
  FormPanelBlock, DetailPanelBlock, ActivityTimelineBlock,
  TabbedPanelBlock, WorkflowProgressBlock,
} from '@middag-io/react';

// Selective registration -- only blocks this plugin uses
registerShell('immersive', ImmersiveShell);
registerLayout('stack', StackLayout);
registerLayout('sidebar', SidebarLayout);
registerLayout('dashboard', DashboardLayout);
registerBlock('dense_table', DenseTableBlock);
registerBlock('metric_card', MetricCardBlock);
registerBlock('empty_state', EmptyStateBlock);
registerBlock('form_panel', FormPanelBlock);
registerBlock('detail_panel', DetailPanelBlock);
registerBlock('activity_timeline', ActivityTimelineBlock);
registerBlock('tabbed_panel', TabbedPanelBlock);
registerBlock('workflow_progress', WorkflowProgressBlock);

// WordPress i18n resolver
const wpResolver = async (key: string) => {
    return wp.i18n.__(key, 'your-plugin-textdomain');
};

// Render (inside Inertia setup)
<I18nProvider asyncResolver={wpResolver}>
    <ContractPage contract={contract} />
</I18nProvider>
```

::: info wp.i18n
WordPress ships `wp.i18n` globally when you enqueue the `wp-i18n` script dependency. The resolver wraps `__()` for MIDDAG's async interface.
:::

::: info Pro — the rich `ProductShell`
The Community engine exports `BasicShell` and `ImmersiveShell` (used above). The richer `ProductShell` — sidebar nav, command palette, inspector, help panel — is **Pro-only**: it lives in `@middag-io/react-pro` and registers via `registerProDefaults()` from `@middag-io/react-pro/runtime` (which registers the `product` shell key plus the Pro blocks). A Pro-tier consumer calls `registerProDefaults()` instead of registering the shell by hand, then sends `'shell' => 'product'` from PHP. Pro packages ship from GitHub Packages (restricted) — see the `create-middag-ui` Pro scaffold.
:::

::: warning Do NOT use registerDefaults() in IIFE builds
`registerDefaults()` registers all blocks including lazy-loaded ones that pull in @xyflow/react, @dnd-kit, and other large dependencies. With `inlineDynamicImports: true` (required for WordPress enqueue), these get inlined into the bundle even if unused. Use selective registration to keep the bundle lean.
:::

### Vite IIFE config

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: '../assets/dist',
        rollupOptions: {
            output: {
                format: 'iife',
                entryFileNames: 'app.js',
                inlineDynamicImports: true,
            },
        },
    },
});
```

::: tip Asset enqueuing
With IIFE output, enqueue the single `app.js` file directly — no manifest needed.
:::

## WP Admin Chrome {#wp-admin-chrome}

WordPress admin has a fixed chrome that MIDDAG renders within:

- **Admin bar** — 32px fixed top bar with site links, user menu, and notifications
- **Admin sidebar** — 160px wide (collapses to 36px on narrow screens or when toggled)
- **Content area** — MIDDAG renders here, to the right of the WP sidebar and below the admin bar

CSS custom properties are set automatically by the host adapter:

```css
--host-header-height: 32px;   /* WP admin bar */
--host-sidebar-width: 160px;  /* WP sidebar (expanded) */
--host-sidebar-width: 36px;   /* WP sidebar (collapsed) */
```

::: warning The WP admin bar and sidebar are permanent
The WordPress admin bar and sidebar are always visible in the admin area. Design your MIDDAG pages within their frame — never attempt to hide or override them.
:::

## PHP Controller {#php-controller}

Register a WordPress admin page and render the contract via Inertia:

```php
// your-plugin.php
add_menu_page(
    'MIDDAG',
    'MIDDAG',
    'manage_options',
    'middag',
    function() {
        $contract = [
            'version' => '1',
            'shell'   => 'immersive',
            'page'    => [
                'key'   => 'dashboard',
                'title' => __('Dashboard', 'your-plugin'),
            ],
            'layout' => [
                'template' => 'stack',
                'regions'  => [
                    'content' => [
                        // Your blocks here
                    ],
                ],
            ],
        ];

        // Render via Inertia
        wp_middag_render('Dashboard', [
            'contract' => $contract,
        ]);
    }
);
```

::: tip wp_middag_render
The `wp_middag_render()` helper handles Inertia response setup, shared props injection, and asset enqueuing. It mirrors what `$this->inertia()` does in the Moodle framework.
:::

## Host Theme Detection {#theme-detection}

MIDDAG automatically detects the WordPress admin color scheme and adapts:

- **Dark mode detection** — reads `body.admin-color-*` classes to determine the active color scheme
- **Known schemes** — `admin-color-default`, `admin-color-light`, `admin-color-modern`, etc. are mapped to light/dark mode
- **Manual override** — users can toggle appearance mode via the sidebar footer toggle, overriding auto-detection
- **CSS variables** — MIDDAG's design tokens adapt to the host theme via `data-theme` attribute on the root element

::: info Appearance toggle
The sidebar footer includes an appearance toggle (sun/moon icon) that lets users switch between light and dark mode regardless of the WordPress admin scheme.
:::

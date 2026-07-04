# Moodle Integration

Integrate MIDDAG React UI into a Moodle plugin using the `local_middag` framework and Inertia.js.

## Prerequisites

- **Moodle 4.5+** with the `local_middag` framework plugin installed
- **PHP 8.2+** with Composer dependencies resolved
- **Inertia.js adapter** configured — the `http_kernel` handles routing and renders Inertia responses
- **Node.js 20+** and npm for the frontend build

## Install @middag-io/react in your plugin {#install}

Navigate to your plugin's UI directory and install the package:

```bash
cd /path/to/moodle/local/your_plugin/ui
npm install @middag-io/react
```

::: tip Monorepo setup
If your plugin uses a monorepo or workspace layout, install at the workspace root and let the package manager hoist the dependency.
:::

## Vite Config {#vite-config}

Configure Vite to produce an AMD-compatible build and externalize Moodle core modules:

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            external: [
                'core/ajax',
                'core/notification',
                'core/str',
            ],
        },
    },
});
```

::: info Moodle AMD modules
Moodle core JS modules (`core/ajax`, `core/str`, etc.) are loaded by Moodle's RequireJS runtime. Mark them as external so Vite does not bundle them.
:::

## Entry Point {#entry-point}

Create your app entry point. Call `registerDefaults()` to populate registries, then set up the Moodle string resolver for i18n:

```tsx
// main.tsx
import { ContractPage, registerDefaults } from '@middag-io/react';
import { I18nProvider } from '@middag-io/react';
import '@middag-io/react/style.css';

registerDefaults();

// Moodle string resolver via core/str
const moodleResolver = async (key: string, component?: string) => {
    const { get_string } = await import('core/str');
    return get_string(key, component || 'local_yourplugin');
};

export function MoodlePage({ contract, help }) {
    return (
        <I18nProvider asyncResolver={moodleResolver}>
            <ContractPage contract={contract} help={help} />
        </I18nProvider>
    );
}
```

::: tip Pre-loaded strings
For performance, pre-load frequently used strings via Inertia shared props (`theme.strings`). The async resolver is a fallback for keys not included in the initial payload.
:::

## PHP Controller {#php-controller}

Define a controller that extends `base\controller` and return an Inertia response with the PageContract:

```php
// classes/controller/my_controller.php
class my_controller extends \local_middag\base\controller {

    #[Route('/local/yourplugin/dashboard', methods: ['GET'])]
    public function dashboard(): Response {
        return $this->inertia('Dashboard', [
            'contract' => $this->build_contract('product', 'dashboard', [
                'page' => [
                    'key'   => 'dashboard',
                    'title' => get_string('dashboard', 'local_yourplugin'),
                ],
                'layout' => [
                    'template' => 'stack',
                    'regions'  => [
                        'content' => [
                            // Your blocks here
                        ],
                    ],
                ],
            ]),
        ]);
    }
}
```

::: info Route discovery
Routes are auto-discovered during `boot()` via PHP 8 attributes. No manual route registration needed.
:::

## Boost Header Integration {#boost-header}

Moodle's Boost theme provides a top header bar (~50px) for global navigation, user menu, and messaging. The MIDDAG sidebar renders below it:

- Boost header occupies the top **50px** of the viewport
- MIDDAG sidebar and content render in the remaining space below
- The CSS custom property `--host-header-height: 50px` is set automatically by the host adapter
- Sidebar height is `calc(100vh - var(--host-header-height))`

::: warning Do NOT replace the Boost header
The Boost header is Moodle's primary navigation — it contains the site menu, course switcher, messaging, and user profile. Never hide, overlay, or replace it. MIDDAG renders exclusively in the content area below.
:::

## i18n with core/str {#i18n}

Moodle uses `get_string(key, component)` for translations. The MIDDAG i18n system bridges this with two strategies:

1. **Pre-loaded strings** — common strings sent via Inertia shared props (`theme.strings`). These are available synchronously via `t(key)`.

2. **Async resolver** — for strings not in the initial payload, the async resolver calls `core/str.get_string()` and caches the result in React state.

```php
// Pre-loading strings in PHP
// In your inertia_shared_props.php or boot()
$shared['theme']['strings'] = [
    'dashboard'       => get_string('dashboard', 'local_yourplugin'),
    'save'            => get_string('save', 'local_yourplugin'),
    'cancel'          => get_string('cancel', 'moodle'),
    'confirm_delete'  => get_string('confirm_delete', 'local_yourplugin'),
];
```

::: tip Batch pre-loading
Pre-load all strings used on the current page. The async resolver is a safety net, not the primary path. Each async call is a separate HTTP request to Moodle.
:::

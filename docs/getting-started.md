# Getting Started

Get up and running with MIDDAG React UI in under five minutes.

## Quick Start (recommended) {#quick-start}

Run the wizard from your plugin project root:

```bash
# Community (no auth needed)
npx create-middag-ui

# PRO (source maps, mock SPA, full exports)
npx @middag-io/create-middag-ui
```

For CI or scripted setups, use `--yes` to skip all prompts:

```bash
npx create-middag-ui --yes            # defaults: ui/, public registry
npx create-middag-ui --yes --github   # defaults: ui/, GitHub Packages
```

The wizard:

1. **Detects your host** — finds `version.php` (Moodle) or `wp-config.php` (WordPress)
2. **Asks for target directory** — default `ui/`, or pass as argument: `npx create-middag-ui mydir`
3. **Configures registry** — npm public (no auth) or GitHub Packages (with source, needs token)
4. **Scaffolds config + demo files** — package.json, tsconfig, Vite config, custom block example, standalone component
5. **Runs npm install** — automatically installs all dependencies
6. **Shows next steps** — how to start the dev server and integrate with your platform

Steps 2–3 are skipped when `--yes` is used. Host detection (step 1) always runs automatically.

After the wizard completes:

```bash
cd ui
npm run dev    # Opens at http://localhost:5174
```

You should see a working admin page with a "Setup Complete" metric card and an example data table. That's your first PageContract rendering.

::: tip What's next after the wizard?
The generated `mock/hello-contract.ts` is your starting point. Edit it to match your plugin's real pages, then connect to your backend. See [CLI docs](/cli) for all available commands.
:::

## Manual Install {#manual-install}

If you prefer to set things up yourself instead of using the wizard:

### Option A: npm public registry (no auth needed)

```bash
# Install the compiled package directly from npm
npm install @middag-io/react react react-dom @inertiajs/react @inertiajs/core
```

### Option B: GitHub Packages (includes TypeScript source)

```bash
# Configure GitHub Packages in your global ~/.npmrc
echo "@middag-io:registry=https://npm.pkg.github.com" >> ~/.npmrc
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> ~/.npmrc

# Install the package with full source
npm install @middag-io/react react react-dom @inertiajs/react @inertiajs/core
```

Create a token at [github.com/settings/tokens](https://github.com/settings/tokens) with the `read:packages` scope. See [Authentication](/authentication) for details.

::: tip Which option?
**npm public** gives you the compiled library and type definitions. Works for most projects.
**GitHub Packages** additionally includes the TypeScript source for IDE navigation into library internals. Requires a GitHub token with `read:packages` scope.
:::

::: tip Peer dependencies
`react` >= 19, `react-dom` >= 19, `@inertiajs/react` >= 2, and `@inertiajs/core` >= 2 are required. If you're already using Inertia.js, these are included.
:::

## Import & Register {#register}

Call `registerDefaults()` once at your app entry point to populate the shell, layout, and block registries with all built-in components:

```tsx
// main.tsx (ESM consumers -- Moodle, standalone)
import { registerDefaults } from '@middag-io/react';
import '@middag-io/react/style.css';

// Register all built-in shells, layouts, and blocks
registerDefaults();
```

::: tip WordPress / IIFE consumers
If your build outputs a single IIFE bundle (WordPress `wp_enqueue_script()`), use **selective registration** instead to keep the bundle lean. See [WordPress Guide](/guides/wordpress#entry-point) for details.
:::

## Wrap with Providers {#providers}

Wrap your app root with the required providers:

```tsx
// App.tsx
import { I18nProvider } from '@middag-io/react';

function App({ children }) {
    return (
        <I18nProvider
            locale="en"
            resolve={(key) => translations[key] ?? key}
        >
            {children}
        </I18nProvider>
    );
}
```

::: info Inertia integration
When using Inertia.js, the providers are typically set up in your `app.tsx` boot file. The shared props from the backend automatically feed navigation, auth, and flash data.
:::

## Render ContractPage {#contract-page}

Pass a `PageContract` object to `ContractPage` and it handles the rest — resolving the shell, layout, and blocks from the registries:

```tsx
// MyPage.tsx
import { ContractPage } from '@middag-io/react';
import type { PageContract } from '@middag-io/react';

const contract: PageContract = {
    version: '1',
    shell: 'product',
    page: {
        key: 'users',
        title: 'Users',
        breadcrumbs: [
            { label: 'Home', href: '/' },
            { label: 'Users' },
        ],
    },
    layout: {
        template: 'stack',
        regions: {
            content: [
                {
                    type: 'dense_table',
                    key: 'users-table',
                    data: {
                        columns: [
                            { key: 'name', label: 'Name' },
                            { key: 'email', label: 'Email' },
                        ],
                        rows: [
                            { id: '1', cells: { name: 'Alice', email: 'alice@example.com' } },
                        ],
                    },
                },
            ],
        },
    },
};

export default function UsersPage() {
    return <ContractPage contract={contract} />;
}
```

## Send Contract from Backend {#backend}

In Moodle, use the Inertia adapter to send the contract as page props:

```php
// PHP -- Moodle Controller
return $this->inertia->render('ContractPage', [
    'contract' => [
        'version' => '1',
        'shell'   => 'product',
        'page'    => [
            'key'         => 'users',
            'title'       => get_string('users', 'local_myplugin'),
            'breadcrumbs' => [
                ['label' => 'Home', 'href' => '/'],
                ['label' => get_string('users', 'local_myplugin')],
            ],
        ],
        'layout' => [
            'template' => 'stack',
            'regions'  => [
                'content' => [
                    [
                        'type' => 'dense_table',
                        'key'  => 'users-table',
                        'data' => $table_data,
                    ],
                ],
            ],
        ],
    ],
]);
```

::: tip WordPress
The same contract shape works with WordPress through the host adapter system. The backend just needs to output the PageContract JSON.
:::

## What's Next {#next}

Now that you have a working setup, explore the rest of the documentation:

- [CLI Reference](/cli) — all 5 commands: init, doctor, dev, add-block, upgrade
- [Page Contracts](/guides/contracts) — understand the anatomy of shells, layouts, and regions
- [Block Reference](/reference/blocks) — block types with data shapes and examples
- [Moodle Integration](/guides/moodle) — full Moodle plugin setup guide
- [WordPress Integration](/guides/wordpress) — WordPress admin plugin setup guide

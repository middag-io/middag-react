# @middag-io/react

Shared React UI library for the MIDDAG ecosystem. Consumed by Moodle (`local_middag`) and WordPress host plugins via Inertia.js.

**[Live Demo](https://ui-demo.middag.io)** | **[Documentation](https://ui-docs.middag.io)**

## Stack

- React 19, TypeScript, Tailwind CSS v4
- Inertia.js (peer dependency — all hosts use Inertia)
- ReUI components (Radix-based)
- TanStack Table, @xyflow/react, @dnd-kit

## Install

### Quick start (recommended)

```bash
npx create-middag-ui
```

The wizard detects your host platform (Moodle/WordPress), configures authentication, and scaffolds a `ui/` directory with a working build.

### Manual install

**npm public (no auth needed):**

```bash
npm install @middag-io/react react react-dom @inertiajs/react @inertiajs/core
```

**GitHub Packages (includes TypeScript source for IDE navigation):**

```bash
# Add to global ~/.npmrc
echo "@middag-io:registry=https://npm.pkg.github.com" >> ~/.npmrc
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> ~/.npmrc

npm install @middag-io/react react react-dom @inertiajs/react @inertiajs/core
```

Create a token at [github.com/settings/tokens](https://github.com/settings/tokens) with `read:packages` scope. See [Authentication](https://ui-docs.middag.io/authentication) for details.

### Distribution

`@middag-io/react` is the complete rendering engine — every block, shell, layout, contract and registry you need to build plugins. Two ways to install it:

- **npm (public, no auth):** compiled ESM bundle + type declarations + declaration maps.
- **GitHub Packages (auth):** adds the TypeScript `src/` for IDE "go to definition". Requires a `read:packages` token (see above).

> MIDDAG also offers a commercial **Pro** tier (`@middag-io/react-pro`) — additional blocks, an application shell and extra themes, used for internal products and consulting. Not needed to build with this library.

## Usage

```tsx
import { ContractPage, registerDefaults } from '@middag-io/react';
import type { PageContract } from '@middag-io/react';

// Register core shells, layouts, and the standard Community blocks
registerDefaults();

// Render a contract-driven page
<ContractPage contract={myContract} />
```

### Selective registration (IIFE consumers)

WordPress and other IIFE consumers should import only the blocks they need to avoid bundling heavy dependencies (@xyflow/react, @dnd-kit, zod, react-hook-form) via `inlineDynamicImports`:

```tsx
import {
  registerShell, registerLayout, registerBlock,
  BasicShell, StackLayout, SidebarLayout, DashboardLayout,
  DenseTableBlock, MetricCardBlock, EmptyStateBlock,
} from '@middag-io/react';

registerShell('product', BasicShell);
registerLayout('stack', StackLayout);
registerLayout('sidebar', SidebarLayout);
registerLayout('dashboard', DashboardLayout);
registerBlock('dense_table', DenseTableBlock);
registerBlock('metric_card', MetricCardBlock);
registerBlock('empty_state', EmptyStateBlock);
```

### Lazy block loading

Blocks can defer data loading until they mount (useful for tabbed pages):

```tsx
// PHP sends block with empty data + lazyProp metadata:
{
  type: 'dense_table',
  key: 'invoices',
  data: {},
  meta: { lazyProp: 'invoices' }
}

// PHP also sends a top-level Inertia prop (initially null):
// 'invoices' => null

// When the block mounts, it auto-fetches via router.reload({ only: ['invoices'] })
// Radix Tabs unmounts inactive tabs, so lazy blocks only fetch when their tab activates
```

### ReUI components

Consumers can import ReUI primitives for custom components:

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@middag-io/react/reui/tabs';
import { Button } from '@middag-io/react/reui/button';
```

### Custom blocks

```tsx
import { registerBlock, type BlockProps } from '@middag-io/react';

function ChartBlock({ block }: BlockProps<{ labels: string[]; values: number[] }>) {
  return <div>{/* your chart */}</div>;
}

registerBlock('chart', ChartBlock);
```

### Contract validation

```tsx
import { validatePageContract } from '@middag-io/react';

const errors = validatePageContract(contractFromBackend);
if (errors) {
  console.error('Invalid contract:', errors);
}
```

Zod schemas are exported for consumers who want to extend validation or generate JSON Schema for PHP consumers.

### i18n with host-specific resolver

```tsx
import { I18nProvider } from '@middag-io/react';

// Moodle: inject Moodle string resolver
<I18nProvider asyncResolver={moodleGetStrings}>
  <App />
</I18nProvider>

// WordPress: inject WP i18n resolver
<I18nProvider asyncResolver={wpGetStrings}>
  <App />
</I18nProvider>
```

## Architecture

```
src/
  app/           # ContractPage, registries (shell/layout/block), providers, LazyBlock
  base/          # Shells, layouts, blocks, hooks, theme, form, partials, registries (field/icon/cell)
  primitives/
    reui/        # ReUI primitives (Radix-based, source of truth)
    examples/    # ReUI component examples (synced from registry)
    ui/svgs/     # AI-provider icons used by examples
  contracts/     # TypeScript types (PageContract, BlockData, etc.)
  lib/           # Generic utilities and hooks
  assets/        # Fonts, lottie animations
  index.ts       # Barrel export
demo/            # Demo harness (standalone SPA — `npm run dev`)
docs/            # Guides, reference and the public JSON schemas
scripts/         # Tooling (contracts codegen, docs payload, sync, doctor)
.githooks/       # Git hooks (pre-commit, commit-msg, pre-push)
```

### What belongs here vs host plugins

| Here (@middag-io/react)     | Host plugin (Moodle/WP)             |
|-----------------------------|-------------------------------------|
| Shells, layouts, blocks     | Extensions with host-specific pages |
| ContractPage renderer       | Inertia server-side adapter         |
| Theme system                | License validation (server-side)    |
| i18n provider (generic)     | i18n resolver (host-specific)       |
| Type contracts              | API endpoints, DB queries           |
| ReUI examples (reference)   | Custom components                   |

## Development

```bash
# Check environment
npm run doctor

# Demo harness -- standalone SPA, no server needed
npm run dev             # http://localhost:5173

# Typecheck
npm run typecheck

# Lint
npm run lint:fix

# Tests
npm test

# Build ESM lib
npm run build
```

The demo harness consumes the engine from `src/` via Vite aliases (instant HMR), mocks `@inertiajs/*` with self-contained adapters in `demo/adapters/`, and renders `PageContract`s end to end.

### ReUI component examples

Examples from the ReUI registry are synced to `src/primitives/examples/` (dev-only). They serve as reference for component usage and are excluded from the published NPM package.

```bash
# Sync all examples from ReUI registry (auto-discovers new components)
npm run sync:examples

# Preview what would be synced
npm run sync:examples -- --dry-run

# Check if new examples are available (used by CI)
npm run sync:examples -- --check
```

A GitHub Action runs weekly (Mondays 8:00 UTC) to check for new examples and opens a PR automatically if updates are available.

## Git Hooks

Configured via `.githooks/` (activated by `npm run prepare`):

| Hook         | Trigger      | Protection                                |
|--------------|--------------|-------------------------------------------|
| `pre-commit` | `git commit` | Typecheck + lint on staged files          |
| `commit-msg` | `git commit` | Enforces Conventional Commits format      |
| `pre-push`   | `git push`   | Typecheck + contract drift + lib build    |

## Versioning

[release-please](https://github.com/googleapis/release-please) owns versioning: it scans Conventional Commits on `main`, opens a release PR (version bump + `CHANGELOG.md`) and, on merge, cuts the tag + GitHub release and publishes. Commit types decide the bump (0.x rule: `feat`/breaking = minor, `fix` = patch).

## CLI

The package includes a CLI for bootstrapping and maintaining the UI layer in consumer projects:

| Command                                 | Description                                                |
|-----------------------------------------|------------------------------------------------------------|
| `npx create-middag-ui`                  | Bootstrap `ui/`                                            |
| `npx @middag-io/react doctor`           | Validate consumer project setup (deps, configs, peer deps) |
| `npx @middag-io/react dev`              | Start mock dev server from consumer project                |
| `npx @middag-io/react add-block <type>` | Scaffold a new block type with component + mock factory    |
| `npx @middag-io/react upgrade`          | Check for updates and run codemods                         |

## Scripts

| Command                   | Description                                    |
|---------------------------|------------------------------------------------|
| `npm run doctor`          | Validate development environment               |
| `npm run dev`             | Demo harness (`demo/`)                         |
| `npm run build`           | Build ESM lib to `dist-lib/`                   |
| `npm run typecheck`       | TypeScript type check                          |
| `npm run lint`            | ESLint check                                   |
| `npm run lint:fix`        | ESLint auto-fix                                |
| `npm run format`          | Prettier format                                |
| `npm run format:check`    | Prettier check                                 |
| `npm test`                | Vitest run (all tests)                         |
| `npm run gen:contracts`   | Regenerate contract types from JSON schemas    |
| `npm run sync:examples`   | Sync ReUI examples from registry               |
| `npm run docs:build`      | Build + verify the public docs payload         |

## Peer Dependencies

- `react` ^19.0.0
- `react-dom` ^19.0.0
- `@inertiajs/react` ^3.0.0
- `@inertiajs/core` ^3.0.0

## CI/CD

| Workflow                     | Trigger                            | What it does                                                    |
|------------------------------|------------------------------------|-----------------------------------------------------------------|
| `ci.yml`                     | Pull requests to main              | Static checks + contract drift + tests/coverage + build         |
| `publish.yml`                | Push to main                       | release-please → publish to GitHub Packages + npm public → docs |
| `notify-schemas-updated.yml` | Push to main (docs/public/schemas) | Notifies downstream consumers of schema changes                 |
| `sync-examples.yml`          | Monday 8:00 UTC / manual           | Sync ReUI examples, opens PR if updates                         |

## License

**Apache-2.0 OSS.** The rendering engine, the standard Community blocks, shells, layouts, contracts and registries. Free to use, fork and ship. See [`LICENSE`](./LICENSE).

> The commercial **Pro** tier (`@middag-io/react-pro` — additional blocks, an application shell, extra themes) is a separate, proprietary package distributed via GitHub Packages. It is not part of this repository and is not needed to build with this library.

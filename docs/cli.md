# CLI

The `@middag-io/react` package ships a CLI for bootstrapping and maintaining the UI layer in your plugin project.

## Commands

| Command                                 | Description                            |
|-----------------------------------------|----------------------------------------|
| `npx create-middag-ui`                  | Bootstrap `ui/` (Community)            |
| `npx @middag-io/create-middag-ui`       | Bootstrap `ui/` (PRO)                  |
| `npx @middag-io/react doctor`           | Validate consumer project setup        |
| `npx @middag-io/react dev`              | Start dev server from consumer project |
| `npx @middag-io/react add-block <type>` | Scaffold a new block type              |
| `npx @middag-io/react upgrade`          | Check for updates and run codemods     |

## init

Bootstraps a `ui/` directory inside your plugin project with everything needed to run a standalone dev server.

```bash
# Community
npx create-middag-ui

# PRO (source maps, mock SPA, full exports)
npx @middag-io/create-middag-ui
```

### Flags

| Flag           | Description                                                         |
|----------------|---------------------------------------------------------------------|
| `--yes` / `-y` | Skip all prompts, use defaults (`ui/`, public registry)             |
| `--github`     | Use GitHub Packages registry (with `--yes` for non-interactive PRO) |
| `<dir>`        | Target directory (positional arg, default: `ui`)                    |

```bash
# Non-interactive: auto-detect host, default dir, public registry
npx create-middag-ui --yes

# Non-interactive PRO: auto-detect host, default dir, GitHub Packages
npx create-middag-ui --yes --github

# Custom directory + non-interactive
npx create-middag-ui mydir --yes
```

Host platform and Moodle component are always auto-detected from `version.php`. Only interactive prompts (directory, registry, token) are skipped by `--yes`.

**What it does:**

1. **Auto-detects your host platform** — looks for `version.php` (Moodle) or `wp-config.php` (WordPress). Falls back to interactive selection (or "Custom" with `--yes`).
2. **Asks for target directory** — default `ui/`, or pass as CLI argument. Skipped with `--yes`.
3. **Configures registry** — npm public (no auth, default) or GitHub Packages (with TypeScript source, needs token). Token saved to global `~/.npmrc`. Skipped with `--yes` (uses `--github` flag if present).
4. **Creates `ui/`** with `package.json`, `tsconfig.json`, `vite.config.ts`, and `index.html` pre-configured for your host.
5. **Generates demo files** — custom block example, standalone component, type re-exports, and theme customization file.
6. **Generates 3 progressive page examples:**
    - `src/pages/dashboard.ts` — **Starter:** metric cards + data table (dashboard layout)
    - `src/pages/connectors.ts` — **Intermediate:** card grid + status strip + detail panel (sidebar layout)
    - `src/pages/settings.ts` — **Advanced:** tabbed panel + form panel + link list (stack layout)
7. **Generates app files** — hash-based page router, mock Inertia adapters, and sidebar navigation.
8. **Runs npm install** — automatically installs all dependencies.
9. **Shows next steps** — how to start the dev server and integrate with your platform.

Your dev server opens at `http://localhost:5174` (Moodle), `5175` (WordPress), or `5176` (Custom).

### Scaffold structure

```
ui/
  index.html              <- dev server entry point (not deployed)
  vite.config.ts          <- Vite config with Inertia mock aliases
  package.json            <- dependencies and scripts
  tsconfig.json           <- TypeScript config
  src/
    main.tsx              <- app entry point (registerDefaults + App)
    app.tsx               <- hash-based router between example pages
    theme.css             <- token overrides + .theme-ocean example
    contracts.ts          <- PageContract type re-exports
    pages/
      dashboard.ts        <- starter example (metric_card + dense_table)
      connectors.ts       <- intermediate example (card_grid + status_strip)
      settings.ts         <- advanced example (tabbed_panel + form_panel)
    blocks/
      hello-block.tsx     <- custom block example (rename me!)
    components/
      greeting.tsx        <- standalone component example (rename me!)
    adapters/
      inertia-react.ts    <- mock @inertiajs/react with navigation
      inertia-core.ts     <- mock @inertiajs/core router
```

### Theme customization

`src/theme.css` is loaded after `@middag-io/react/style.css` and wins by CSS cascade. It includes:

- **Global token overrides** — uncomment `:root` block to change defaults
- **`.theme-ocean` example** — a complete scoped theme (apply via `class="middag-root theme-ocean"` on root div)
- **Custom styles section** — project-specific CSS using MIDDAG tokens

All colors use OKLCH color space. See [oklch.com](https://oklch.com) for visual picking.

### Example output

```
Initializing MIDDAG React UI...

  [1/10] Detecting host platform
  ✓ Detected: Moodle (found version.php)

  [2/10] Target directory
  ✓ Target: ui/

  [3/10] Registry configuration
  ✓ Using npm public registry (no authentication needed)

  [4/10] Creating directory
  ✓ Created ui/

  [5/10] Scaffolding config files
  ✓ Created package.json
  ✓ Created tsconfig.json
  ✓ Created vite.config.ts
  ✓ Created index.html

  [6/10] Registry setup
  ✓ No registry config needed (using npm public)

  [7/10] Creating demo files
  ✓ Created src/blocks/hello-block.tsx
  ✓ Created src/components/greeting.tsx
  ✓ Created src/contracts.ts
  ✓ Created src/theme.css

  [8/10] Creating app and page examples
  ✓ Created src/main.tsx
  ✓ Created src/app.tsx
  ✓ Created src/adapters/inertia-react.ts
  ✓ Created src/adapters/inertia-core.ts
  ✓ Created src/pages/dashboard.ts
  ✓ Created src/pages/connectors.ts
  ✓ Created src/pages/settings.ts

  [9/10] Installing dependencies
  ✓ Dependencies installed

  [10/10] Done!

  MIDDAG React UI ready in ui/ (12.3s)

  Start developing:
    cd ui
    npm run dev              -> dev server at http://localhost:5174

  Docs: https://ui-docs.middag.io
```

## doctor

Validates that your consumer project has all the required dependencies, configs, and peer dependencies installed correctly.

```bash
npx @middag-io/react doctor
```

**Checks performed:**

- Node.js version (>= 20)
- `ui/` directory exists
- `@middag-io/react` is installed
- Registry config (optional: `~/.npmrc` for GitHub Packages, not needed for npm public)
- Peer dependencies: `react`, `react-dom`, `@inertiajs/react`
- `tsconfig.json` exists
- `vite.config.ts` exists

::: tip
Run `doctor` after cloning a project or when something isn't working. It pinpoints exactly what's missing.
:::

## dev

Starts the dev server from your consumer project. Equivalent to `cd ui && npm run dev`.

```bash
npx @middag-io/react dev
```

## add-block

Scaffolds a new custom block type with the component file.

```bash
npx @middag-io/react add-block chart_panel
```

**Creates:**

- `ui/src/blocks/ChartPanelBlock.tsx` — block component implementing `BlockProps<ChartPanelBlockData>`

**After scaffolding:**

1. Import and register the block:
   ```tsx
   import { registerBlock } from '@middag-io/react';
   import { ChartPanelBlock } from './blocks/ChartPanelBlock';

   registerBlock("chart_panel", ChartPanelBlock);
   ```
2. Add a page contract using it: `{ key: "chart_panel_1", type: "chart_panel", data: {...} }`

## upgrade

Checks for the latest version of `@middag-io/react` and updates your consumer project.

```bash
npx @middag-io/react upgrade
```

Compares your installed version against the latest published version and runs `npm install @middag-io/react@latest` if an update is available.

::: info Future: codemods
When breaking changes are introduced, `upgrade` will also run codemods to automatically update your code. For example, if a PageContract field is renamed, the codemod rewrites your contracts.
:::

## Authentication

`@middag-io/react` is published on **npm public** (no auth needed) and **GitHub Packages** (includes TypeScript source, needs token).

The `init` wizard asks which registry you prefer:

- **npm public (default):** No configuration needed. Works out of the box.
- **GitHub Packages:** The wizard asks for your GitHub token, validates it, and saves it to global `~/.npmrc` automatically.

If you need to set up GitHub Packages manually:

```bash
echo "@middag-io:registry=https://npm.pkg.github.com" >> ~/.npmrc
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> ~/.npmrc
```

Create a token at [github.com/settings/tokens](https://github.com/settings/tokens) with the `read:packages` scope.

::: warning
Always store tokens in `~/.npmrc` (global), never in project-local `.npmrc`. Project files can be committed to git accidentally.
:::

See [Authentication](/authentication) for full details, CI/Docker setup, and troubleshooting.

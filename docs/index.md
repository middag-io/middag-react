---
layout: home

hero:
  name: MIDDAG React UI
  text: Contract-driven components for Moodle & WordPress
  tagline: The backend sends a PageContract JSON object. The frontend renders it. No manual wiring needed.
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: Live Demo
      link: https://ui-demo.middag.io
    - theme: alt
      text: API Reference
      link: /reference/api

features:
  - title: Contract-Driven
    details: The backend builds a PageContract describing shell, layout, and blocks. The frontend resolves each piece through registries and renders the full page automatically.
  - title: Host-Agnostic
    details: Works with Moodle, WordPress, or any Inertia.js host. The host adapter system handles chrome, i18n, and theme detection transparently.
  - title: Block Catalog
    details: From dense tables and form panels to flow editors and sentence builders. Every block is data-driven with a typed contract.
  - title: Dark Mode & RTL
    details: Three-tier theme resolution (manual, host, OS) with full right-to-left support. OKLCH color system for perceptual uniformity.
  - title: Type-Safe
    details: Full TypeScript types for PageContract, BlockDescriptor, NavigationNode, SharedProps, and all block data interfaces.
  - title: Extensible
    details: Register custom shells, layouts, and blocks. Override built-in components. Compose providers for auth, i18n, flash, scope, and progress.
---

## Quick Overview

```ts
import { ContractPage, registerDefaults } from '@middag-io/react';
import '@middag-io/react/style.css';

// Register all built-in shells, layouts, and blocks
registerDefaults();

// Render a page from a contract
<ContractPage contract={contract} />
```

The rendering pipeline:

```
Backend (PHP)  -->  Inertia  -->  ContractPage  -->  Shell  -->  Layout  -->  Blocks
```

## Architecture

| Layer        | Description                                                             |
|--------------|-------------------------------------------------------------------------|
| **Shell**    | Outermost wrapper (sidebar, header, navigation)                         |
| **Layout**   | Region arrangement inside the shell (stack, sidebar, dashboard, wizard) |
| **Block**    | Atomic rendering unit placed in a layout region                         |
| **Provider** | React context bridges for i18n, auth, flash, scope, progress            |

## Install

```bash
# Community — wizard auto-detects your host and scaffolds ui/
npx create-middag-ui

# PRO — source maps, mock SPA, full exports
npx @middag-io/create-middag-ui

# Then:
cd ui && npm install && npm run dev
```

Or install manually: `npm install @middag-io/react` (see [Getting Started](/getting-started#manual-install) for auth setup).

## CLI

| Command                                 | Description                        |
|-----------------------------------------|------------------------------------|
| `npx create-middag-ui`                  | Bootstrap `ui/` (Community)        |
| `npx @middag-io/create-middag-ui`       | Bootstrap `ui/` (PRO)              |
| `npx @middag-io/react doctor`           | Validate consumer project setup    |
| `npx @middag-io/react dev`              | Start mock dev server              |
| `npx @middag-io/react add-block <type>` | Scaffold a new block type          |
| `npx @middag-io/react upgrade`          | Check for updates and run codemods |

See [CLI Reference](/cli) for details.

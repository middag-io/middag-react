# Developing — middag-react (FREE engine)

`@middag-io/react` is the FREE engine: base UI, ReUI primitives, contracts, and
i18n. It builds and runs standalone. The PRO runtime, premium blocks, and the
full ui-demo live in the separate `middag-react-pro` repo and consume this
package.

## Engine-only workflow

```bash
git clone git@github.com:middag-io/middag-react.git
cd middag-react
npm ci
npm run dev          # FREE demo SPA (demo/), aliased to src/ with live HMR
```

Other commands:

```bash
npm run build         # ESM lib → dist-lib/ (main bundle + subpaths + d.ts)
npm run build:watch   # incremental rebuild of the main bundle on change
npm run check         # typecheck + lint + format:check
npm test              # vitest
npm run doctor        # validate the environment
```

`npm run dev` reads everything from `src/`, so engine edits hot-reload with no
build step. The `demo/` harness is FREE-only (no PRO, no credentials).

## Working on the engine together with PRO

When a change spans this repo and `middag-react-pro` (new engine API a PRO block
needs, a shared fix, etc.), drive it from the **PRO** repo — its `react-demo` SPA
loads both the engine and react-pro from source with live HMR across the two.

Canonical layout (any parent dir; folder names are what matter):

```
<any-dir>/
├── middag-react/       # this repo
└── middag-react-pro/   # PRO — run `npm run dev:pro` there
```

The PRO repo symlinks this checkout as its engine automatically (its `prepare`
runs `engine:link`). Full cross-repo guide, including the source-vs-built gotcha:
**`middag-react-pro/DEVELOPING.md`**.

### The one thing to remember

PRO's `dev:pro` SPA sees your `src/` edits live, but PRO's **typecheck / tests /
build** compile against this repo's **built `dist-lib/`**. If you change engine
source and then run PRO tooling, rebuild here first:

```bash
npm run build          # one-off
npm run build:watch    # or keep dist-lib fresh while you work
```

From the PRO repo the same is available as `npm run engine:build` /
`npm run engine:build:watch`, and `npm run doctor` there warns when this repo's
`dist-lib` is stale.

## Releasing

release-please (conventional commits → automated release PR). This package
versions independently of `@middag-io/react-pro`; PRO pins the engine it depends
on via a peer range and bumps it deliberately.

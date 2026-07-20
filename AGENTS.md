# AGENTS.md — middag-react

`@middag-io/react` — shared React UI library for the MIDDAG ecosystem, consumed by Moodle (`local_middag`) and WordPress host plugins via Inertia.js. React 19 + TypeScript + Tailwind CSS v4, ReUI (Radix-based) components. Live demo at <https://ui-demo.middag.io>, docs at <https://ui-docs.middag.io>.

**What this repo is NOT:**

- Pro/private components live in `middag-react-pro`.
- Licensed-module delivery (CDN contract) lives in `middag-js-licensing`; the licensing worker in `worker-ts-middag-licensing`.
- Host apps (Moodle/WP plugins) own their pages — this repo ships components, not product screens.

## Git

- Conventional Commits; **never** `Co-Authored-By`.
- Base branch: `main` trunk-based.

## Language

Docs and commits in EN (public repo).

## Quality gates

Green before delivering: `npm run check` (typecheck app+tests+demo, lint, format:check) and `npm test`. Full build: `npm run build`.

## Inherited rules (pointers, do not copy)

- npm publishing uses OIDC Trusted Publishing — no npm token secrets in CI (NORM-P3-15, see `docs-middag-ops`).
- Docs payload publishes to the docs proxy per ADR-016 (`docs:build` / `docs:verify`).
- Org doctrine via docs-MCP (alias `ops`) or `docs-middag-ops`; planning/backlog in `tool-middag-planning`.

## NOT in scope / do not do without permission

- Publishing releases / touching the release pipeline.
- Regenerating vendored ReUI examples (`npm run sync:examples`) — deliberate, reviewed operation.

## Gotchas — READ before touching

1. Contracts are GENERATED: `npm run gen:contracts` writes them, `gen:contracts:check` gates — never hand-edit generated contract files.
2. Git hooks come from `.githooks` (`prepare` sets `core.hooksPath`) — run `npm install` once so they activate.
3. Subpath builds are separate (`build:subpaths` + `patch-esm.mjs`) — plain `vite build` alone is not the full artifact.

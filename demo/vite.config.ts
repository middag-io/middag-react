import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const REPO = path.resolve(__dirname, "..");

/**
 * Vite config — FREE demo harness (`npm run dev` at the repo root).
 *
 * Minimal standalone SPA that exercises the Community engine only:
 * no @middag-io/react-pro, no packages/react-demo, no GitHub Packages.
 * Consumes the engine from source (src/) for fast HMR while iterating.
 *
 * The PRO demo (host-sim shells, premium blocks, full page gallery) lives in
 * packages/react-demo — run it with `npm run dev:pro`.
 *
 * Run:   npm run dev            (from the repo root)
 * Build: vite build --config demo/vite.config.ts
 */
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      {
        find: /^@middag-io\/react\/reui\/(.*)$/,
        replacement: path.join(REPO, "src/primitives/reui/$1"),
      },
      { find: /^@middag-io\/react\/form\/(.*)$/, replacement: path.join(REPO, "src/base/form/$1") },
      {
        find: /^@middag-io\/react\/partials\/(.*)$/,
        replacement: path.join(REPO, "src/base/partials/$1"),
      },
      { find: /^@middag-io\/react\/i18n\/(.*)$/, replacement: path.join(REPO, "src/i18n/$1") },
      { find: /^@middag-io\/react\/lib\/(.*)$/, replacement: path.join(REPO, "src/lib/$1") },
      {
        find: /^@middag-io\/react\/shell\/(.*)$/,
        replacement: path.join(REPO, "src/base/shell/$1"),
      },
      {
        find: /^@middag-io\/react\/utils\/(.*)$/,
        replacement: path.join(REPO, "src/base/utils/$1"),
      },
      {
        find: /^@middag-io\/react\/theme\/(.*)$/,
        replacement: path.join(REPO, "src/base/theme/$1"),
      },
      { find: /^@middag-io\/react$/, replacement: path.join(REPO, "src/index.ts") },
      { find: /^@\/(.*)$/, replacement: path.join(REPO, "src/$1") },
      {
        find: /^@inertiajs\/react$/,
        replacement: path.resolve(__dirname, "adapters/inertia-react.ts"),
      },
      {
        find: /^@inertiajs\/core$/,
        replacement: path.resolve(__dirname, "adapters/inertia-core.ts"),
      },
    ],
  },
  root: __dirname,
  publicDir: path.join(REPO, "public"),
  server: {
    port: 5173,
    open: !process.env.E2E && !process.env.CI,
    // Dev root is demo/; the engine source and hoisted node_modules
    // (e.g. @fontsource-variable/figtree fonts) live at the repo root.
    fs: {
      allow: [REPO],
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
});

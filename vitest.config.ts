import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Array form: ordered, first match wins. The @middag-io/react subpaths
    // must be listed before the bare specifier so they are not swallowed by it.
    alias: [
      {
        find: /^@middag-io\/react\/reui\/(.*)$/,
        replacement: path.resolve(__dirname, "./src/components/reui/$1"),
      },
      {
        find: /^@middag-io\/react\/form\/(.*)$/,
        replacement: path.resolve(__dirname, "./src/base/form/$1"),
      },
      {
        find: /^@middag-io\/react\/partials\/(.*)$/,
        replacement: path.resolve(__dirname, "./src/base/partials/$1"),
      },
      {
        find: /^@middag-io\/react\/i18n\/(.*)$/,
        replacement: path.resolve(__dirname, "./src/i18n/$1"),
      },
      {
        find: /^@middag-io\/react\/lib\/(.*)$/,
        replacement: path.resolve(__dirname, "./src/lib/$1"),
      },
      {
        find: /^@middag-io\/react\/shell\/(.*)$/,
        replacement: path.resolve(__dirname, "./src/base/shell/$1"),
      },
      {
        find: /^@middag-io\/react\/utils\/(.*)$/,
        replacement: path.resolve(__dirname, "./src/base/utils/$1"),
      },
      {
        find: /^@middag-io\/react\/theme\/(.*)$/,
        replacement: path.resolve(__dirname, "./src/base/theme/$1"),
      },
      {
        find: /^@middag-io\/react\/schemas\/(.*)$/,
        replacement: path.resolve(__dirname, "./docs/public/schemas/$1"),
      },
      { find: /^@middag-io\/react$/, replacement: path.resolve(__dirname, "./src/index.ts") },
      { find: /^@\/(.*)$/, replacement: path.resolve(__dirname, "./src/$1") },
    ],
  },
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
    // Pin the timezone so local-calendar logic (time.ts relative/group labels)
    // is deterministic across developer machines and CI.
    env: { TZ: "UTC" },
    coverage: {
      provider: "v8",
      // Measure the published library surface only. Read-only synced trees
      // (reui/examples), generated contracts, type-only decls and barrels
      // carry no testable logic and would only skew the ratio.
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/components/reui/**",
        "src/components/examples/**",
        "src/contracts/generated/**",
        "src/**/*.d.ts",
        "src/**/index.ts",
        "src/assets/**",
      ],
      reporter: ["text-summary", "text", "html"],
      // Regression floor ≈ baseline − 2pp (baseline 2026-07-04, 396 tests:
      // stmts 56.12 · branch 44.13 · funcs 52.59 · lines 57.50). Not a target —
      // raise as coverage grows; never lower without a reason stated in the PR.
      thresholds: {
        statements: 54,
        branches: 42,
        functions: 50,
        lines: 55,
      },
    },
  },
});

import fs from "node:fs";
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

/**
 *  * Vite config for the deep-subpath ESM build.
 *
 * The package exports wildcard subpath families (./reui/*, ./shell/*, ./lib/*,
 * ./utils/*, ./theme/*, ./i18n/*) that historically resolved to raw src/*.tsx —
 * forcing every consumer bundler to compile engine sources and resolve the
 * internal "@/" alias. This build emits one stable ESM file per module of those
 * families into dist-lib/, mirroring the src/ tree, so package.json#exports can
 * point at built JS instead (the matching .d.ts are already emitted there by
 * tsc -p tsconfig.build.json).
 *
 * Design constraints:
 *  - Runs AFTER the main `vite build` (which has emptyOutDir: true) — see the
 *    root "build" script order. emptyOutDir here MUST stay false.
 *  - Every bare import (react, radix-ui, lucide-react, …) is externalized: the
 *    per-module files keep the exact dependency semantics raw src had, with
 *    deps resolved from this package's own dependencies at consumer build time.
 *  - Shared internal code (e.g. src/lib/utils) dedupes into chunks/subpath-*.js;
 *    only the entry filenames are contract, chunk names may change freely.
 *  - Non-TS assets of the families (theme css/txt, i18n locale JSON) are copied
 *    verbatim so the ./theme/*.css, ./theme/*.txt and ./i18n/locales/*.json
 *    export patterns keep working without shipping-from-src.
 *
 * Run:   npm run build:subpaths   (part of `npm run build`)
 */

const SRC = path.resolve(__dirname, "src");
const OUT = path.resolve(__dirname, "dist-lib");

/** Families published as built deep subpaths (src-relative directories). */
const FAMILIES = ["components/reui", "base/shell", "base/utils", "base/theme", "lib", "i18n"];

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "__tests__") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

const familyFiles = FAMILIES.flatMap((family) => walk(path.join(SRC, family)));

const entries: Record<string, string> = {};
for (const file of familyFiles) {
  if (!/\.(ts|tsx)$/.test(file) || file.endsWith(".d.ts")) continue;
  const key = path.relative(SRC, file).replace(/\.(ts|tsx)$/, "");
  if (entries[key]) {
    throw new Error(`[subpaths] duplicate module key "${key}" (.ts and .tsx siblings?)`);
  }
  entries[key] = file;
}

/** Copy the families' non-TS assets (css/txt/json) into the dist-lib mirror. */
function copyFamilyAssets(): Plugin {
  return {
    name: "middag:copy-family-assets",
    closeBundle() {
      for (const file of familyFiles) {
        // .md = maintainer docs (MANIFEST.md), not a consumable asset.
        if (/\.(ts|tsx|md)$/.test(file)) continue;
        const dest = path.join(OUT, path.relative(SRC, file));
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(file, dest);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), copyFamilyAssets()],
  resolve: {
    alias: {
      "@": SRC,
    },
  },
  build: {
    outDir: OUT,
    emptyOutDir: false,
    copyPublicDir: false,
    // Library mode (multi-entry): preserves every entry's export signature.
    // A plain rollupOptions.input build treeshakes entry exports that no OTHER
    // entry uses (preserveEntrySignatures=false) — emitting empty modules.
    lib: {
      entry: entries,
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      // Externalize every bare specifier: same semantics raw src had — deps
      // resolve from this package's dependencies at consumer build time.
      // "@/" is the internal alias (resolved above), never external.
      external: (id) =>
        !id.startsWith(".") && !path.isAbsolute(id) && !id.startsWith("@/") && !id.startsWith("\0"),
      output: {
        chunkFileNames: "chunks/subpath-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});

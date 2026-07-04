/**
 * One-shot catalog codemod: import a TS module that default/named-exports a
 * flat Record<string,string>, write it as sorted JSON for an i18next namespace.
 *
 * Usage:
 *   node scripts/i18n-migrate-catalog.mjs <src.ts> <exportName> <out.json>
 * Example:
 *   node scripts/i18n-migrate-catalog.mjs \
 *     src/app/providers/i18n-defaults.ts LIB_UI_DEFAULTS \
 *     src/i18n/locales/en/ui.json
 */
import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { tsImport } from "tsx/esm/api"; // run TS sources directly (Node >=20: register() is deprecated)

const [, , srcPath, exportName, outPath] = process.argv;
if (!srcPath || !exportName || !outPath) {
  console.error("usage: node scripts/i18n-migrate-catalog.mjs <src.ts> <exportName> <out.json>");
  process.exit(1);
}

const mod = await tsImport(pathToFileURL(srcPath).href, import.meta.url);
const record = mod[exportName] ?? mod.default;
if (!record || typeof record !== "object") {
  console.error(`export ${exportName} not found or not an object in ${srcPath}`);
  process.exit(1);
}

const sorted = Object.fromEntries(Object.entries(record).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(outPath, JSON.stringify(sorted, null, 2) + "\n");
console.log(`wrote ${Object.keys(sorted).length} keys -> ${outPath}`);

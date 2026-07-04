/**
 * Post-build script: patches Rolldown's CJS require() polyfill out of ESM output.
 *
 * Rolldown (Vite 8) emits a `typeof require` polyfill when CJS deps
 * (e.g. use-sync-external-store) call require() on externals (react).
 * This breaks in browser ESM context. We replace the polyfill with an
 * ESM-compatible module map that resolves external requires via imports.
 */

import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const DIST = join(import.meta.dirname, "..", "dist-lib");

const EXTERNALS = {
  react: "__cjs_react",
  "react-dom": "__cjs_react_dom",
};

let patched = 0;

// Recursive: the subpath build (vite.subpaths.config.ts) emits .js files in
// nested directories (components/reui/, base/, lib/, chunks/, …).
function* walkJs(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walkJs(full);
    else if (entry.isFile() && entry.name.endsWith(".js")) yield full;
  }
}

for (const filePath of walkJs(DIST)) {
  const file = relative(DIST, filePath);
  let code = readFileSync(filePath, "utf-8");
  if (!code.includes("typeof require")) continue;

  // Match the full Rolldown require IIFE:
  //   /* @__PURE__ */ ((e) => typeof require < "u" ? require : ...)(function(e) { ... })
  // Strategy: find the IIFE start, then balance parens to find the end.
  const marker = "/* @__PURE__ */ ((e) => typeof require";
  const startIdx = code.indexOf(marker);
  if (startIdx === -1) continue;

  // Walk forward from the first `(` after `/* @__PURE__ */`, balancing parens.
  // The IIFE is: ((e) => typeof require ...)(function(e) { ... })
  // First pass finds the arrow function wrapper `)`, second pass finds the
  // argument call `(function(e){...})`. We need BOTH.
  let firstParen = code.indexOf("(", startIdx + 15);
  let depth = 0;
  let endIdx = -1;
  let closedOnce = false;
  for (let i = firstParen; i < code.length; i++) {
    if (code[i] === "(") depth++;
    if (code[i] === ")") {
      depth--;
      if (depth === 0) {
        if (closedOnce) {
          // Second time depth hits 0 = end of full IIFE call
          endIdx = i + 1;
          break;
        }
        closedOnce = true;
        // First close: check if next char is `(` (the call)
        if (code[i + 1] === "(") {
          // Continue into the argument
          continue;
        } else {
          // No call — just the arrow wrapper
          endIdx = i + 1;
          break;
        }
      }
    }
  }
  if (endIdx === -1) continue;

  const polyfill = code.substring(startIdx, endIdx);

  // Build ESM replacement
  const modEntries = Object.entries(EXTERNALS)
    .map(([id, alias]) => `"${id}": ${alias}`)
    .join(", ");
  const replacement = `((id) => { const m = {${modEntries}}; if (m[id]) return m[id]; throw Error("Cannot require " + id + " in ESM bundle") })`;

  code = code.replace(polyfill, replacement);

  // Add ESM imports at the top
  const imports = Object.entries(EXTERNALS)
    .map(([id, alias]) => `import * as ${alias} from "${id}";`)
    .join("\n");

  writeFileSync(filePath, imports + "\n" + code);
  patched++;
  console.log(`[patch-esm] Patched ${file}: replaced ${polyfill.length} byte require() polyfill`);
}

if (patched === 0) {
  console.log("[patch-esm] No files needed patching (ok if no CJS externals)");
} else {
  console.log(`[patch-esm] Done: ${patched} file(s) patched`);
}

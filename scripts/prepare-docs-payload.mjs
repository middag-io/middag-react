#!/usr/bin/env node
/**
 * prepare-docs-payload.mjs — build the documentation payload for the MIDDAG
 * edge-aggregation platform (ADR-016: Build-Time Aggregation via Edge Storage).
 *
 * Library repos do not render a site. They emit a versioned payload that mirrors
 * the R2 upload taxonomy `/{repo}/[docs|xref|schemas]/{version}/*` and is later
 * pushed to Cloudflare R2 by CI (publish.yml `sync-docs` job, via the reusable
 * middag-io/.github-private docs-sync-r2.yml — bucket `middag-docs-public`).
 * This script only builds the payload locally into `.docs-dist/`; it performs
 * NO upload.
 *
 * FREE/PRO policy (E1.6): the payload is PUBLIC — FREE content only. Internal
 * material under docs/ is excluded at copy time (see INTERNAL_DOCS below) and
 * the final payload is re-scanned by verify-docs-payload.mjs, which fails the
 * build if anything internal slips through.
 */
import { execSync } from "node:child_process";
import { access, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { verifyDocsPayload } from "./verify-docs-payload.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = resolve(ROOT, ".docs-dist");
const PACKAGE = "middag-react";
const FALLBACK_VERSION = "0.19.0";

const pathExists = async (p) => {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
};

const readVersion = async () => {
  try {
    const pkg = JSON.parse(await readFile(resolve(ROOT, "package.json"), "utf8"));
    return pkg.version || FALLBACK_VERSION;
  } catch {
    return FALLBACK_VERSION;
  }
};

const version = await readVersion();
console.log(`[docs-payload] ${PACKAGE}@${version}`);

// 1. Clean the payload dir.
await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

// 2. xref — generated reference, by TypeDoc (ADR-015 tooling).
console.log(`[docs-payload] typedoc -> .docs-dist/xref/${version}`);
execSync(`npx typedoc --out .docs-dist/xref/${version}`, { cwd: ROOT, stdio: "inherit" });

// 3. schemas — contract schemas as their own artifact kind (ADR-016 §1).
//    Copied into the payload; the originals stay in docs/public/schemas/ because
//    the MCP server (packages/mcp-middag-ui) bundles them from there at build time.
const schemasSrc = resolve(ROOT, "docs", "public", "schemas");
const hasSchemas = await pathExists(schemasSrc);
if (hasSchemas) {
  const schemasOut = resolve(DIST, "schemas", version);
  await mkdir(schemasOut, { recursive: true });
  await cp(schemasSrc, schemasOut, { recursive: true, dereference: true });
  console.log(`[docs-payload] copied schemas -> .docs-dist/schemas/${version}`);
}

// 4. docs — raw narrative Markdown only. Actively excluded from the copy:
//    - public/      (assets + the schemas handled above; not narrative Markdown)
//    - CLAUDE.md    (internal agent instructions — must NOT reach the public bucket)
//    - superpowers/ (internal dev/implementation plans — must NOT reach the public bucket)
//    dereference:true resolves symlinks (e.g. changelog.md -> ../CHANGELOG.md) to real content.
const docsSrc = resolve(ROOT, "docs");
if (await pathExists(docsSrc)) {
  const docsOut = resolve(DIST, "docs", version);
  await mkdir(dirname(docsOut), { recursive: true });
  const INTERNAL_DOCS = [
    resolve(docsSrc, "public"),
    resolve(docsSrc, "CLAUDE.md"),
    resolve(docsSrc, "superpowers"),
  ];
  await cp(docsSrc, docsOut, {
    recursive: true,
    dereference: true,
    filter: (src) => !INTERNAL_DOCS.some((p) => src === p || src.startsWith(p + sep)),
  });
  console.log(
    `[docs-payload] copied docs/ (excl. public/, CLAUDE.md, superpowers/) -> .docs-dist/docs/${version}`,
  );
}

// 5. Manifest consumed by middag-docs-proxy-client at hub build time.
const manifest = {
  package: PACKAGE,
  latest: version,
  versions: {
    [version]: {
      released_at: new Date().toISOString(),
      has_schemas: hasSchemas,
      has_reference: true,
      languages: ["en"],
    },
  },
};
await writeFile(resolve(DIST, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log("[docs-payload] wrote .docs-dist/manifest.json");

// 6. FREE/PRO policy gate — independent re-scan of the final payload. Throws
//    (non-zero exit) if internal content survived the copy filter above.
verifyDocsPayload(DIST);
console.log("[docs-payload] verify OK — no internal content in the public payload");
console.log("[docs-payload] done.");

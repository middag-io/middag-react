#!/usr/bin/env node
/* global console, process */
/**
 * verify-docs-payload.mjs — deny-scan of the public docs payload (.docs-dist/).
 *
 * FREE/PRO docs policy (E1.6): everything under docs/ that reaches the public
 * R2 bucket (`middag-docs-public`, ADR-016) is FREE content. Internal material
 * (agent instructions, dev plans, planning artifacts) must never ship there.
 * prepare-docs-payload.mjs excludes those paths at copy time; this script is
 * the independent second layer — it re-scans the FINAL payload so a filter
 * regression (or a new internal dir nobody thought to exclude) fails the
 * build instead of silently publishing.
 *
 * Runs automatically at the end of `npm run docs:build` and standalone via
 * `node scripts/verify-docs-payload.mjs [dist-dir]` (defaults to .docs-dist).
 */
import { readdirSync, realpathSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** Paths that must NEVER appear in the public docs payload. */
export const FORBIDDEN = [
  { re: /(^|\/)CLAUDE\.md$/i, label: "agent instructions (CLAUDE.md)" },
  { re: /(^|\/)superpowers(\/|$)/i, label: "internal dev plans (docs/superpowers/)" },
  { re: /(^|\/)\.planning(\/|$)/i, label: "planning artifacts (.planning/)" },
];

/** Recursively list files under dir as payload-relative POSIX paths. */
export function listPayloadFiles(dir, base = dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listPayloadFiles(abs, base));
    } else {
      out.push(relative(base, abs).split("\\").join("/"));
    }
  }
  return out;
}

/** Return the list of policy violations found in the payload dir. */
export function findViolations(dist) {
  const violations = [];
  for (const path of listPayloadFiles(dist)) {
    for (const { re, label } of FORBIDDEN) {
      if (re.test(path)) violations.push({ path, label });
    }
  }
  return violations;
}

/** Scan and throw when the payload carries forbidden content. */
export function verifyDocsPayload(dist) {
  const violations = findViolations(dist);
  if (violations.length) {
    const lines = violations.map((v) => `    ${v.path}  <- ${v.label}`);
    throw new Error(
      `public docs payload contains forbidden internal content:\n${lines.join("\n")}`,
    );
  }
}

// realpath both sides so symlinked invocations still run (see the E1.4 gate).
let isCli = false;
if (process.argv[1]) {
  try {
    isCli = realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    isCli = false;
  }
}
if (isCli) {
  const dist = resolve(
    process.argv[2] ?? join(dirname(fileURLToPath(import.meta.url)), "..", ".docs-dist"),
  );
  try {
    verifyDocsPayload(dist);
  } catch (err) {
    console.error(`✗ docs payload verify FAILED — ${err.message}`);
    process.exit(1);
  }
  console.log(`✓ docs payload verify OK (${dist}) — no internal content in the public payload`);
}

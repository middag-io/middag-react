/**
 * FREE/PRO docs-policy gate (E1.6).
 *
 * The public docs payload (.docs-dist/) is uploaded verbatim to the public R2
 * bucket, so anything internal that survives prepare-docs-payload's copy
 * filter is published to the world. verify-docs-payload.mjs is the
 * independent second layer; this suite pins its deny-list semantics and the
 * CLI gate against disposable fixture payloads.
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { findViolations, verifyDocsPayload } from "../../scripts/verify-docs-payload.mjs";

const SCRIPT = path.resolve(__dirname, "../../scripts/verify-docs-payload.mjs");

const tmpDirs: string[] = [];

function makePayload(files: Record<string, string>): string {
  const dist = mkdtempSync(path.join(tmpdir(), "docs-payload-"));
  tmpDirs.push(dist);
  for (const [rel, content] of Object.entries(files)) {
    const abs = path.join(dist, rel);
    mkdirSync(path.dirname(abs), { recursive: true });
    writeFileSync(abs, content);
  }
  return dist;
}

afterEach(() => {
  while (tmpDirs.length) rmSync(tmpDirs.pop()!, { recursive: true, force: true });
});

const CLEAN_PAYLOAD = {
  "manifest.json": "{}",
  "docs/0.34.0/index.md": "# home",
  "docs/0.34.0/guides/theme.md": "# theme",
  "schemas/0.34.0/page-contract.json": "{}",
  "xref/0.34.0/index.html": "<html></html>",
};

describe("findViolations — deny-list over the final payload", () => {
  it("passes a clean FREE payload", () => {
    const dist = makePayload(CLEAN_PAYLOAD);
    expect(findViolations(dist)).toEqual([]);
    expect(() => verifyDocsPayload(dist)).not.toThrow();
  });

  it("flags internal dev plans under superpowers/ anywhere in the tree", () => {
    const dist = makePayload({
      ...CLEAN_PAYLOAD,
      "docs/0.34.0/superpowers/plans/2026-06-04-plan.md": "# internal plan",
    });
    const violations = findViolations(dist);
    expect(violations).toHaveLength(1);
    expect(violations[0].path).toBe("docs/0.34.0/superpowers/plans/2026-06-04-plan.md");
    expect(() => verifyDocsPayload(dist)).toThrow(/superpowers/);
  });

  it("flags CLAUDE.md at any depth (agent instructions)", () => {
    const dist = makePayload({
      ...CLEAN_PAYLOAD,
      "docs/0.34.0/CLAUDE.md": "# agent instructions",
    });
    expect(findViolations(dist).map((v) => v.path)).toEqual(["docs/0.34.0/CLAUDE.md"]);
  });

  it("flags .planning/ artifacts", () => {
    const dist = makePayload({
      ...CLEAN_PAYLOAD,
      "docs/0.34.0/.planning/BACKLOG.md": "# backlog",
    });
    expect(findViolations(dist)).toHaveLength(1);
  });

  it("does NOT flag lookalikes (changelog.md, files merely mentioning PRO)", () => {
    const dist = makePayload({
      ...CLEAN_PAYLOAD,
      "docs/0.34.0/changelog.md": "# changelog",
      "docs/0.34.0/guides/wordpress.md": "Pro-only shell ships from GitHub Packages.",
    });
    expect(findViolations(dist)).toEqual([]);
  });
});

describe("CLI gate", () => {
  it("exits 0 on a clean payload", () => {
    const dist = makePayload(CLEAN_PAYLOAD);
    const out = execFileSync(process.execPath, [SCRIPT, dist], { encoding: "utf8" });
    expect(out).toContain("verify OK");
  });

  it("exits non-zero and names the offending path when internal content leaks", () => {
    const dist = makePayload({
      ...CLEAN_PAYLOAD,
      "docs/0.34.0/superpowers/plans/leak.md": "# leak",
    });
    expect(() => execFileSync(process.execPath, [SCRIPT, dist], { encoding: "utf8" })).toThrow(
      /superpowers\/plans\/leak\.md/,
    );
  });
});

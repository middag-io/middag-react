/**
 * Contracts mirror pull request guard.
 *
 * The contracts mirror bot opens a pull request whose title and commit feed
 * release-please. A breaking contract change must never reach it as a
 * conventional-commit breaking marker ('!' or a BREAKING CHANGE footer): the
 * break is described only in the pull request body. This suite runs the
 * "Open the pull request" step of the workflow with stubbed git and gh, and
 * pins the title, the commit message and the body for each compat level.
 */

import { execFileSync } from "node:child_process";
import { chmodSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

const WORKFLOW = path.resolve(__dirname, "../../.github/workflows/contracts-mirror.yml");
const STEP_NAME = "- name: Open the pull request";
const TAG = "v9.9.9";
const BREAKING_MARKER = /!:|BREAKING[ -]CHANGE/;

const tmpDirs: string[] = [];

afterEach(() => {
  while (tmpDirs.length) rmSync(tmpDirs.pop()!, { recursive: true, force: true });
});

/** Extracts the `run: |` block of the named step, dedented. */
function extractStepScript(workflow: string, stepName: string): string {
  const lines = workflow.split("\n");
  const stepIndex = lines.findIndex((line) => line.trim() === stepName);
  if (stepIndex < 0) throw new Error(`step not found: ${stepName}`);
  const runIndex = lines.findIndex((line, i) => i > stepIndex && line.trim() === "run: |");
  if (runIndex < 0) throw new Error(`run block not found for: ${stepName}`);
  const runIndent = lines[runIndex].search(/\S/);
  const body: string[] = [];
  for (const line of lines.slice(runIndex + 1)) {
    if (line.trim() !== "" && line.search(/\S/) <= runIndent) break;
    body.push(line);
  }
  const indent = Math.min(...body.filter((l) => l.trim() !== "").map((l) => l.search(/\S/)));
  return body.map((l) => l.slice(indent)).join("\n");
}

interface StepRun {
  isDraft: boolean;
  title: string;
  commitMessage: string;
  body: string;
}

/** Writes an executable stub; `record` logs its argv NUL-separated, one call per RS-terminated record. */
function writeStub(dir: string, name: string, script: string): void {
  const file = path.join(dir, name);
  writeFileSync(file, `#!/usr/bin/env bash\n${script}\n`);
  chmodSync(file, 0o755);
}

function runStep(level: string, typecheck = "success"): StepRun {
  const dir = mkdtempSync(path.join(tmpdir(), "contracts-mirror-"));
  tmpDirs.push(dir);
  const bin = path.join(dir, "bin");
  execFileSync("mkdir", [bin]);
  const log = path.join(dir, "calls.log");
  const record = `printf '%s\\0' "$(basename "$0")" "$@" >> "${log}"; printf '\\036' >> "${log}"`;
  writeStub(bin, "git", record);
  // `gh pr view` fails so the step goes on to `gh pr create`.
  writeStub(bin, "gh", `${record}\n[ "$2" = "view" ] && exit 1\nexit 0`);

  const script = extractStepScript(readFileSync(WORKFLOW, "utf8"), STEP_NAME);
  // Same shell flags as a GitHub Actions `run:` step.
  execFileSync("bash", ["--noprofile", "--norc", "-eo", "pipefail", "-c", script], {
    env: { PATH: `${bin}:${process.env.PATH}`, TAG, LEVEL: level, TYPECHECK: typecheck },
  });

  const calls = readFileSync(log, "utf8")
    .split("\x1e")
    .filter(Boolean)
    .map((line) => line.split("\0").filter((_, i, all) => i < all.length - 1));
  const commit = calls.find((c) => c[0] === "git" && c[1] === "commit");
  const create = calls.find((c) => c[0] === "gh" && c[1] === "pr" && c[2] === "create");
  if (!commit || !create) throw new Error("expected a git commit and a gh pr create call");
  const argAfter = (args: string[], flag: string): string => args[args.indexOf(flag) + 1];
  const messages = commit.filter((_, i) => commit[i - 1] === "-m");
  return {
    isDraft: create.includes("--draft"),
    title: argAfter(create, "--title"),
    commitMessage: messages.join("\n\n"),
    body: argAfter(create, "--body"),
  };
}

describe("contracts mirror pull request", () => {
  it("keeps a plain feat type and describes a breaking change only in the body", () => {
    const run = runStep("breaking");

    expect(run.title).toBe(`feat(ui-contracts): mirror the middag-php-ui ${TAG} schemas`);
    expect(run.title).not.toMatch(BREAKING_MARKER);
    expect(run.commitMessage).not.toMatch(BREAKING_MARKER);
    expect(run.body).not.toMatch(BREAKING_MARKER);
    expect(run.body).toContain("## Breaking change");
    expect(run.body).toContain("x-contract-version");
  });

  it("uses feat for an additive change, with no breaking section", () => {
    const run = runStep("additive");

    expect(run.title).toBe(`feat(ui-contracts): mirror the middag-php-ui ${TAG} schemas`);
    expect(run.body).not.toContain("## Breaking change");
  });

  it("uses fix for a regeneration with no wire change", () => {
    const run = runStep("none");

    expect(run.title).toBe(`fix(ui-contracts): mirror the middag-php-ui ${TAG} schemas`);
    expect(run.commitMessage).not.toMatch(BREAKING_MARKER);
    expect(run.body).not.toContain("## Breaking change");
  });

  it("still opens a draft when the typecheck of a breaking mirror is red", () => {
    const run = runStep("breaking", "failure");

    expect(run.isDraft).toBe(true);
    expect(run.title).not.toMatch(BREAKING_MARKER);
    expect(run.body).toContain("## Breaking change");
    expect(run.body).toContain("Typecheck is red");
  });

  it("never writes a breaking marker anywhere in the workflow", () => {
    const workflow = readFileSync(WORKFLOW, "utf8");
    const script = extractStepScript(workflow, STEP_NAME);

    expect(script).not.toMatch(/\)!/);
    expect(script).not.toMatch(/BREAKING[ -]CHANGE:/);
  });
});

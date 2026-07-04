/**
 * E2.9b guard — the static PageContract fixtures under public/api/example/
 * must validate against the CURRENT contract schema (the same Zod validator
 * ContractPage runs at runtime). This is the anti-drift gate: any fixture that
 * falls behind the contracts fails here instead of silently shipping a stale
 * "wire example" that teaches AI agents the wrong shape.
 *
 * Fixtures live in the repo-root public/ (served by the demo's publicDir).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { validatePageContract } from "@/contracts/page-contract-schema";

const EXAMPLE_ROOT = join(__dirname, "../../public/api/example");

function walkJson(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walkJson(full));
    else if (entry.endsWith(".json")) out.push(full);
  }
  return out;
}

describe("public/api example fixtures", () => {
  const files = walkJson(EXAMPLE_ROOT);

  it("has example fixtures to validate", () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it.each(files)("%s wraps a valid PageContract", (file) => {
    const raw = JSON.parse(readFileSync(file, "utf8")) as { contract?: unknown };
    expect(raw.contract, `${file} must have a { contract } envelope`).toBeTruthy();
    const errors = validatePageContract(raw.contract);
    expect(errors, JSON.stringify(errors, null, 2)).toBeNull();
  });
});

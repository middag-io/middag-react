import { describe, expect, it } from "vitest";

import { knownValue, mapOrUndefined, normalizeFilters, normalizeRows } from "@/base/utils/php-wire";

describe("php-wire", () => {
  it("turns an empty-list row into an empty record and keeps the others", () => {
    const row = { id: 1, name: "A" };

    expect(normalizeRows([row, []])).toEqual([row, {}]);
    expect(normalizeRows([row])[0]).toBe(row);
  });

  it("reads an empty-list map as absent", () => {
    expect(mapOrUndefined([])).toBeUndefined();
    expect(mapOrUndefined(undefined)).toBeUndefined();
    expect(mapOrUndefined(null)).toBeUndefined();
    expect(mapOrUndefined({ a: "success" })).toEqual({ a: "success" });
  });

  it("normalises filters sent as an empty list or with empty applied values", () => {
    const available = [{ key: "status", label: "Status", type: "select" }];

    expect(normalizeFilters([])).toBeUndefined();
    expect(normalizeFilters(undefined)).toBeUndefined();
    expect(normalizeFilters({ available, applied: [] })).toEqual({ available, applied: {} });
    expect(normalizeFilters({ available, applied: { status: ["a", "b"] } })).toEqual({
      available,
      applied: { status: ["a", "b"] },
    });
  });

  it("keeps a known enum value and drops an unknown one", () => {
    const known = ["positive", "negative", "neutral"] as const;

    expect(knownValue("negative", known)).toBe("negative");
    expect(knownValue("sideways", known)).toBeUndefined();
    expect(knownValue(undefined, known)).toBeUndefined();
  });
});

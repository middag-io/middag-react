import type { TFunction } from "i18next";
import { describe, expect, it } from "vitest";

import { isTranslatableLabel, renderLabel } from "@/i18n/render-label";

// Minimal fake TFunction: returns key, or defaultValue, or interpolates name.
const t = ((key: string, opts?: Record<string, unknown>) => {
  if (key === "x.has_default") return (opts?.defaultValue as string) ?? key;
  if (key === "x.greeting") return `Hi ${String(opts?.name ?? "{name}")}`;
  return key;
}) as unknown as TFunction;

describe("renderLabel (i18next)", () => {
  it("returns a literal string verbatim", () => {
    expect(renderLabel("Plain", t)).toBe("Plain");
  });
  it("returns empty for null/undefined", () => {
    expect(renderLabel(null, t)).toBe("");
    expect(renderLabel(undefined, t)).toBe("");
  });
  it("resolves a Translatable via t with params", () => {
    expect(renderLabel({ key: "x.greeting", domain: "", params: { name: "Ana" } }, t)).toBe(
      "Hi Ana",
    );
  });
  it("passes domain as namespace and key as defaultValue", () => {
    expect(renderLabel({ key: "x.has_default", domain: "ui" }, t)).toBe("x.has_default");
  });
  it("narrows Translatable shape", () => {
    expect(isTranslatableLabel({ key: "a", domain: "" })).toBe(true);
    expect(isTranslatableLabel("nope")).toBe(false);
  });
});

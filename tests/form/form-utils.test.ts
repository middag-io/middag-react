import { describe, expect, it } from "vitest";

import {
  extractFields,
  isFieldDisabled,
  isFieldRequired,
  isFieldVisible,
} from "@/base/form/form-utils";
import type { FormFieldNode, FormSchemaNode } from "@/contracts/block-data";

function field(key: string, props: Record<string, unknown> = {}): FormFieldNode {
  return {
    kind: "field",
    key,
    component: "text",
    props: { label: key, ...props },
  } as FormFieldNode;
}

const header = { kind: "field", key: "h", component: "header", props: {} } as FormFieldNode;

describe("extractFields", () => {
  it("flattens fields across nested sections and groups in order", () => {
    const tree = [
      field("a"),
      {
        kind: "section",
        children: [field("b"), { kind: "group", children: [field("c")] }],
      },
    ] as unknown as FormSchemaNode[];

    expect(extractFields(tree).map((f) => f.key)).toEqual(["a", "b", "c"]);
  });
});

describe("isFieldVisible", () => {
  it("treats headers as always visible", () => {
    expect(isFieldVisible(header, {})).toBe(true);
  });

  it("hides when hidden_when matches", () => {
    const f = field("x", { hidden_when: { field: "mode", operator: "equals", value: "auto" } });
    expect(isFieldVisible(f, { mode: "auto" })).toBe(false);
    expect(isFieldVisible(f, { mode: "manual" })).toBe(true);
  });

  it("hides when visible_when does not match", () => {
    const f = field("x", { visible_when: { field: "mode", operator: "equals", value: "auto" } });
    expect(isFieldVisible(f, { mode: "manual" })).toBe(false);
    expect(isFieldVisible(f, { mode: "auto" })).toBe(true);
  });
});

describe("isFieldDisabled", () => {
  it("never disables headers", () => {
    expect(isFieldDisabled(header, {})).toBe(false);
  });

  it("respects the static disabled prop", () => {
    expect(isFieldDisabled(field("x", { disabled: true }), {})).toBe(true);
  });

  it("applies disabled_when conditionally", () => {
    const f = field("x", { disabled_when: { field: "mode", operator: "equals", value: "auto" } });
    expect(isFieldDisabled(f, { mode: "auto" })).toBe(true);
    expect(isFieldDisabled(f, { mode: "manual" })).toBe(false);
  });
});

describe("isFieldRequired", () => {
  it("never requires headers", () => {
    expect(isFieldRequired({ ...header, props: { required: true } } as FormFieldNode, {})).toBe(
      false,
    );
  });

  it("respects the static required prop", () => {
    expect(isFieldRequired(field("x", { required: true }), {})).toBe(true);
  });

  it("applies required_when conditionally", () => {
    const f = field("x", { required_when: { field: "type", operator: "equals", value: "other" } });
    expect(isFieldRequired(f, { type: "other" })).toBe(true);
    expect(isFieldRequired(f, { type: "self" })).toBe(false);
  });

  it("never treats a disabled field as required (UX deadlock guard)", () => {
    const f = field("x", {
      required: true,
      disabled_when: { field: "mode", operator: "equals", value: "auto" },
    });
    // disabled wins even though required is set
    expect(isFieldRequired(f, { mode: "auto" })).toBe(false);
    expect(isFieldRequired(f, { mode: "manual" })).toBe(true);
  });
});

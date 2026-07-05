import type { TFunction } from "i18next";
import { describe, expect, it } from "vitest";

import { buildFormSchema } from "@/base/form/form-schema-builder";
import type { FormSchemaNode } from "@/contracts/block-data";

// The builder only uses `t` to label error messages; the key itself is enough
// to assert success/failure, so an identity stub keeps the tests deterministic.
const t = ((key: string) => key) as unknown as TFunction;

function buildShape(schema: FormSchemaNode[], values: Record<string, unknown> = {}) {
  return buildFormSchema(schema, values, t);
}

describe("buildFormSchema", () => {
  it("enforces a basic required text field and accepts optional empty strings", () => {
    const required = buildShape([
      { kind: "field", key: "name", component: "text", props: { label: "Name", required: true } },
    ]);
    expect(required.safeParse({ name: "" }).success).toBe(false);
    expect(required.safeParse({ name: "Ada" }).success).toBe(true);

    const optional = buildShape([
      { kind: "field", key: "name", component: "text", props: { label: "Name" } },
    ]);
    expect(optional.safeParse({ name: "" }).success).toBe(true);
  });

  it("applies required_when only when the controlling field matches", () => {
    const nodes: FormSchemaNode[] = [
      { kind: "field", key: "type", component: "text", props: { label: "Type" } },
      {
        kind: "field",
        key: "reason",
        component: "text",
        props: {
          label: "Reason",
          required_when: { field: "type", operator: "equals", value: "other" },
        },
      },
    ];

    const matched = buildShape(nodes, { type: "other" });
    expect(matched.safeParse({ type: "other", reason: "" }).success).toBe(false);
    expect(matched.safeParse({ type: "other", reason: "broken" }).success).toBe(true);

    const unmatched = buildShape(nodes, { type: "standard" });
    expect(unmatched.safeParse({ type: "standard", reason: "" }).success).toBe(true);
  });

  it("treats int/float as nullable when optional and rejects null when required", () => {
    const optional = buildShape([
      { kind: "field", key: "age", component: "int", props: { label: "Age" } },
      { kind: "field", key: "ratio", component: "float", props: { label: "Ratio" } },
    ]);
    expect(optional.safeParse({ age: null, ratio: null }).success).toBe(true);
    expect(optional.safeParse({ age: 30, ratio: 1.5 }).success).toBe(true);
    // Empty string is neither a number nor null — the default-typing fix
    // means optional numerics arrive as null, never "".
    expect(optional.safeParse({ age: "", ratio: null }).success).toBe(false);

    const required = buildShape([
      { kind: "field", key: "age", component: "int", props: { label: "Age", required: true } },
    ]);
    expect(required.safeParse({ age: null }).success).toBe(false);
    expect(required.safeParse({ age: 42 }).success).toBe(true);
  });

  it("validates checkbox/switch as booleans", () => {
    const schema = buildShape([
      { kind: "field", key: "agree", component: "checkbox", props: { label: "Agree" } },
      { kind: "field", key: "active", component: "switch", props: { label: "Active" } },
    ]);
    expect(schema.safeParse({ agree: true, active: false }).success).toBe(true);
    expect(schema.safeParse({ agree: "yes", active: false }).success).toBe(false);
  });

  it("validates multiselect/tags as string arrays and enforces required minimum", () => {
    const optional = buildShape([
      { kind: "field", key: "roles", component: "multiselect", props: { label: "Roles" } },
      { kind: "field", key: "tags", component: "tags", props: { label: "Tags" } },
    ]);
    expect(optional.safeParse({ roles: [], tags: [] }).success).toBe(true);
    expect(optional.safeParse({ roles: ["admin"], tags: ["urgent"] }).success).toBe(true);

    const required = buildShape([
      {
        kind: "field",
        key: "roles",
        component: "multiselect",
        props: { label: "Roles", required: true },
      },
    ]);
    expect(required.safeParse({ roles: [] }).success).toBe(false);
    expect(required.safeParse({ roles: ["admin"] }).success).toBe(true);
  });

  it("omits invisible fields from the schema so their rules are not enforced", () => {
    const nodes: FormSchemaNode[] = [
      { kind: "field", key: "plan", component: "text", props: { label: "Plan" } },
      {
        kind: "field",
        key: "seats",
        component: "int",
        props: {
          label: "Seats",
          required: true,
          visible_when: { field: "plan", operator: "equals", value: "team" },
        },
      },
    ];

    const hidden = buildShape(nodes, { plan: "solo" });
    expect(Object.keys(hidden.shape)).not.toContain("seats");
    expect(hidden.safeParse({ plan: "solo" }).success).toBe(true);

    const visible = buildShape(nodes, { plan: "team" });
    expect(Object.keys(visible.shape)).toContain("seats");
    expect(visible.safeParse({ plan: "team", seats: null }).success).toBe(false);
  });

  // Document validation is lazily imported (validator.js stays out of the form
  // chunk), so the refine is async and must be parsed with safeParseAsync.
  it("rejects an invalid document via the lazily-loaded validator", async () => {
    const schema = buildShape([
      {
        kind: "field",
        key: "doc",
        component: "document",
        props: { label: "Doc", required: true, documentType: "pt-BR", documentScope: "person" },
      },
    ]);
    const result = await schema.safeParseAsync({ doc: "123" });
    expect(result.success).toBe(false);
  });

  it("accepts a generic document and an optional empty document", async () => {
    const required = buildShape([
      { kind: "field", key: "doc", component: "document", props: { label: "Doc", required: true } },
    ]);
    expect((await required.safeParseAsync({ doc: "ABC123" })).success).toBe(true);
    expect((await required.safeParseAsync({ doc: "" })).success).toBe(false);

    const optional = buildShape([
      { kind: "field", key: "doc", component: "document", props: { label: "Doc" } },
    ]);
    expect((await optional.safeParseAsync({ doc: "" })).success).toBe(true);
  });

  it("suppresses required when disabled_when makes the field unfillable", () => {
    const nodes: FormSchemaNode[] = [
      { kind: "field", key: "mode", component: "text", props: { label: "Mode" } },
      {
        kind: "field",
        key: "note",
        component: "text",
        props: {
          label: "Note",
          required: true,
          disabled_when: { field: "mode", operator: "equals", value: "auto" },
        },
      },
    ];

    const disabled = buildShape(nodes, { mode: "auto" });
    expect(disabled.safeParse({ mode: "auto", note: "" }).success).toBe(true);

    const enabled = buildShape(nodes, { mode: "manual" });
    expect(enabled.safeParse({ mode: "manual", note: "" }).success).toBe(false);
  });
});

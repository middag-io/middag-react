/**
 * Golden PHP-payload fixtures for the PageContract wire schema.
 *
 * These mirror what middag-php-ui emits end-to-end (envelope + page meta +
 * navigation + multi-block layout) and lock three things the prior suite did
 * not cover:
 *  - a realistic full contract validates clean (regression anchor).
 *  - invalid data NESTED inside the layout/blocks is actually rejected,
 *          with the error path pointing at the offending location.
 *  - parsing preserves the known nested shape (no silent drop/mangle).
 */

import { describe, expect, it } from "vitest";

import { pageContractSchema, validatePageContract } from "@/contracts/page-contract-schema";

// A realistic PHP-emitted contract: product shell, dashboard layout with two
// regions, page meta with breadcrumbs + actions, and a navigation tree.
const goldenContract = {
  version: "1" as const,
  shell: "product",
  page: {
    key: "connectors.index",
    title: "Connectors",
    meta: {
      breadcrumbs: [{ label: "Home", href: "/" }, { label: "Connectors" }],
      actions: [
        {
          id: "create",
          label: "New connector",
          target: { kind: "route", name: "connectors.create" },
          intent: "primary",
        },
      ],
    },
  },
  navigation: {
    items: [
      { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: "home" },
      { key: "connectors", label: "Connectors", href: "/connectors", icon: "plug" },
    ],
  },
  layout: {
    template: "dashboard",
    regions: {
      header: [
        { type: "metric_card", key: "kpi-total", data: { value: 128, label: "Total" } },
        { type: "metric_card", key: "kpi-active", data: { value: "92%", label: "Active" } },
      ],
      content: [
        {
          type: "status_strip",
          key: "health",
          data: {
            items: [{ key: "uptime", label: "Uptime", value: "99.9%", appearance: "success" }],
          },
        },
        {
          type: "link_list",
          key: "docs",
          data: { items: [{ label: "Docs", href: "/docs", icon: "file-text" }] },
        },
      ],
    },
  },
};

describe("PageContract golden fixtures", () => {
  it("validates a full PHP-shaped contract clean", () => {
    expect(validatePageContract(goldenContract)).toBeNull();
  });

  it("validates with an empty content region", () => {
    const contract = {
      ...goldenContract,
      layout: { template: "stack", regions: { content: [] } },
    };
    expect(validatePageContract(contract)).toBeNull();
  });
});

describe("PageContract nested rejection", () => {
  it("rejects a block descriptor missing its key, pointing at the layout path", () => {
    const contract = {
      ...goldenContract,
      layout: {
        template: "stack",
        regions: { content: [{ type: "metric_card", data: { value: 1, label: "x" } }] },
      },
    };
    const errors = validatePageContract(contract);
    expect(errors).not.toBeNull();
    expect(errors!.some((e) => e.field.includes("layout"))).toBe(true);
  });

  it("rejects a block descriptor missing its type", () => {
    const contract = {
      ...goldenContract,
      layout: {
        template: "stack",
        regions: { content: [{ key: "m1", data: { value: 1, label: "x" } }] },
      },
    };
    expect(validatePageContract(contract)).not.toBeNull();
  });

  it("rejects a block action missing its id (typed Action[], not the opaque data blob)", () => {
    const contract = {
      ...goldenContract,
      layout: {
        template: "stack",
        regions: {
          content: [
            {
              type: "metric_card",
              key: "m1",
              data: { value: 1, label: "x" },
              // BlockDescriptor.actions is a typed Action[] (id required) — unlike
              // `data`, which is deliberately an opaque blob on the wire.
              actions: [
                { label: "Broken", target: { kind: "route", name: "x" }, intent: "primary" },
              ],
            },
          ],
        },
      },
    };
    expect(validatePageContract(contract)).not.toBeNull();
  });
});

describe("PageContract shape preservation", () => {
  it("preserves the nested block tree through parse (no silent drop)", () => {
    const parsed = pageContractSchema.parse(goldenContract) as typeof goldenContract;
    expect(parsed.page.title).toBe("Connectors");
    expect(parsed.layout.regions.header).toHaveLength(2);
    expect(parsed.layout.regions.content[0].key).toBe("health");
    // Block descriptors keep their type/key/data triple.
    expect(parsed.layout.regions.header[0]).toMatchObject({
      type: "metric_card",
      key: "kpi-total",
    });
  });
});

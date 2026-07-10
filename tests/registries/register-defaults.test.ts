import { beforeEach, describe, expect, it, vi } from "vitest";

// ---------------------------------------------------------------------------
// After vi.resetModules(), dynamic imports of both register-defaults AND
// registries resolve to fresh module instances that share the same Maps.
// This ensures registerDefaults() populates the Maps we inspect.
// ---------------------------------------------------------------------------

describe("registerDefaults", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  async function loadModules() {
    const registries = await import("@/app/registries");
    const registerDefaultsMod = await import("@/app/register-defaults");
    return { registries, registerDefaultsMod };
  }

  it("populates all 3 registries", async () => {
    const { registries, registerDefaultsMod } = await loadModules();
    registerDefaultsMod.registerDefaults();

    expect(registries.shellRegistry.size).toBeGreaterThan(0);
    expect(registries.layoutRegistry.size).toBeGreaterThan(0);
    expect(registries.blockRegistry.size).toBeGreaterThan(0);
  });

  it('shellRegistry has "basic" + "immersive" + "auth" (product ships in @middag-io/react-pro)', async () => {
    const { registries, registerDefaultsMod } = await loadModules();
    registerDefaultsMod.registerDefaults();

    expect(registries.shellRegistry.has("basic")).toBe(true);
    expect(registries.shellRegistry.has("immersive")).toBe(true);
    // `auth` — chromeless centered shell for guest entry points (login).
    expect(registries.shellRegistry.has("auth")).toBe(true);
    // The rich `product` shell registers via @middag-io/react-pro's
    // registerProDefaults(), not the free engine's registerDefaults().
    expect(registries.shellRegistry.has("product")).toBe(false);
    expect(registries.shellRegistry.size).toBe(3);
  });

  it("layoutRegistry has all 4 layout templates", async () => {
    const { registries, registerDefaultsMod } = await loadModules();
    registerDefaultsMod.registerDefaults();

    const expectedLayouts = ["stack", "sidebar", "dashboard", "wizard"];
    for (const key of expectedLayouts) {
      expect(registries.layoutRegistry.has(key)).toBe(true);
    }
    expect(registries.layoutRegistry.size).toBe(expectedLayouts.length);
  });

  it("blockRegistry has the 13 standard block types (premium blocks register via @middag-io/react-pro)", async () => {
    const { registries, registerDefaultsMod } = await loadModules();
    registerDefaultsMod.registerDefaults();

    const expectedBlocks = [
      "dense_table",
      "empty_state",
      "metric_card",
      "status_strip",
      "detail_panel",
      "activity_timeline",
      "markdown_panel",
      "card_grid",
      "action_grid",
      "link_list",
      "tabs",
      "form_panel",
      "chart",
    ];
    for (const key of expectedBlocks) {
      expect(registries.blockRegistry.has(key)).toBe(true);
    }
    expect(registries.blockRegistry.size).toBe(expectedBlocks.length);

    // The 6 premium/interactive blocks are NOT registered by the free engine.
    const premiumBlocks = [
      "chart_panel",
      "flow_editor",
      "condition_tree",
      "sentence_builder",
      "form_builder",
      "kanban_board",
    ];
    for (const key of premiumBlocks) {
      expect(registries.blockRegistry.has(key)).toBe(false);
    }
  });

  it("calling registerDefaults() twice is idempotent", async () => {
    const { registries, registerDefaultsMod } = await loadModules();

    // First call
    registerDefaultsMod.registerDefaults();
    const shellSize = registries.shellRegistry.size;
    const layoutSize = registries.layoutRegistry.size;
    const blockSize = registries.blockRegistry.size;

    // Second call — `registered` flag guards against double registration
    registerDefaultsMod.registerDefaults();

    expect(registries.shellRegistry.size).toBe(shellSize);
    expect(registries.layoutRegistry.size).toBe(layoutSize);
    expect(registries.blockRegistry.size).toBe(blockSize);
  });
});

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import "../setup";

import { block, tabsData } from "../helpers";

// Mock resolveBlock to avoid needing full registry setup.
// TabsBlock resolves inner blocks via resolveBlock().
vi.mock("@/engine/registries", async () => {
  const actual = await vi.importActual<typeof import("@/engine/registries")>("@/engine/registries");
  return {
    ...actual,
    resolveBlock: vi.fn().mockReturnValue(undefined),
  };
});

describe("TabsBlock", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders tab labels", async () => {
    const { TabsBlock } = await import("@/base/blocks/TabsBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("tabs", "test-tabs", tabsData());

    render(
      <I18nProvider>
        <TabsBlock block={descriptor} />
      </I18nProvider>,
    );

    expect(screen.getByText("General")).toBeDefined();
    expect(screen.getByText("Advanced")).toBeDefined();
  });

  it("renders default tab as active", async () => {
    const { TabsBlock } = await import("@/base/blocks/TabsBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("tabs", "test-tabs-default", tabsData());

    render(
      <I18nProvider>
        <TabsBlock block={descriptor} />
      </I18nProvider>,
    );

    // The "General" trigger should have data-state="active"
    const generalTrigger = screen.getByText("General").closest("[role='tab']");
    expect(generalTrigger).not.toBeNull();
    expect(generalTrigger!.getAttribute("data-state")).toBe("active");
  });

  it("renders empty div when tabs array is empty", async () => {
    const { TabsBlock } = await import("@/base/blocks/TabsBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const data = { tabs: [], defaultTab: undefined };
    const descriptor = block("tabs", "test-tabs-empty", data);

    const { container } = render(
      <I18nProvider>
        <TabsBlock block={descriptor} />
      </I18nProvider>,
    );

    // Should render an empty div, no tabs
    expect(container.querySelector("[role='tablist']")).toBeNull();
  });

  it("renders a localized, token-styled fallback for unknown inner blocks", async () => {
    const { TabsBlock } = await import("@/base/blocks/TabsBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("tabs", "test-tabs-unknown", tabsData());

    const { container } = render(
      <I18nProvider>
        <TabsBlock block={descriptor} />
      </I18nProvider>,
    );

    // Localized label (en) instead of the raw hardcoded English string.
    expect(container.textContent).toContain("Unknown block type:");
    // The block type shows inside a <code>, not interpolated into the sentence.
    expect(container.querySelector("code")?.textContent).toBe("empty_state");
    // No inline dashed-border style — replaced by Tailwind tokens.
    expect(container.querySelector('[style*="dashed"]')).toBeNull();
  });
});

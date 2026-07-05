import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import "../setup";

import { block, tabbedPanelData } from "../helpers";

// Mock resolveBlock to avoid needing full registry setup.
// TabbedPanelBlock resolves inner blocks via resolveBlock().
vi.mock("@/app/registries", async () => {
  const actual = await vi.importActual<typeof import("@/app/registries")>("@/app/registries");
  return {
    ...actual,
    resolveBlock: vi.fn().mockReturnValue(undefined),
  };
});

describe("TabbedPanelBlock", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders tab labels", async () => {
    const { TabbedPanelBlock } = await import("@/base/blocks/TabbedPanelBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("tabbed_panel", "test-tabs", tabbedPanelData());

    render(
      <I18nProvider>
        <TabbedPanelBlock block={descriptor} />
      </I18nProvider>,
    );

    expect(screen.getByText("General")).toBeDefined();
    expect(screen.getByText("Advanced")).toBeDefined();
  });

  it("renders default tab as active", async () => {
    const { TabbedPanelBlock } = await import("@/base/blocks/TabbedPanelBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("tabbed_panel", "test-tabs-default", tabbedPanelData());

    render(
      <I18nProvider>
        <TabbedPanelBlock block={descriptor} />
      </I18nProvider>,
    );

    // The "General" trigger should have data-state="active"
    const generalTrigger = screen.getByText("General").closest("[role='tab']");
    expect(generalTrigger).not.toBeNull();
    expect(generalTrigger!.getAttribute("data-state")).toBe("active");
  });

  it("renders empty div when tabs array is empty", async () => {
    const { TabbedPanelBlock } = await import("@/base/blocks/TabbedPanelBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const data = { tabs: [], defaultTab: undefined };
    const descriptor = block("tabbed_panel", "test-tabs-empty", data);

    const { container } = render(
      <I18nProvider>
        <TabbedPanelBlock block={descriptor} />
      </I18nProvider>,
    );

    // Should render an empty div, no tabs
    expect(container.querySelector("[role='tablist']")).toBeNull();
  });

  it("renders a localized, token-styled fallback for unknown inner blocks", async () => {
    const { TabbedPanelBlock } = await import("@/base/blocks/TabbedPanelBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("tabbed_panel", "test-tabs-unknown", tabbedPanelData());

    const { container } = render(
      <I18nProvider>
        <TabbedPanelBlock block={descriptor} />
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

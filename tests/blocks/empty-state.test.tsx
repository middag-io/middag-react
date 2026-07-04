import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import "../setup";

import { block, emptyStateData } from "../helpers";

describe("EmptyStateBlock", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders description text", async () => {
    const { EmptyStateBlock } = await import("@/base/blocks/EmptyStateBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("empty_state", "test-empty", emptyStateData());

    render(
      <I18nProvider>
        <EmptyStateBlock block={descriptor} />
      </I18nProvider>,
    );

    expect(screen.getByText("No items found")).toBeDefined();
  });

  it("uses block title when provided", async () => {
    const { EmptyStateBlock } = await import("@/base/blocks/EmptyStateBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("empty_state", "test-empty-title", emptyStateData(), {
      title: "Custom Title",
    });

    render(
      <I18nProvider>
        <EmptyStateBlock block={descriptor} />
      </I18nProvider>,
    );

    expect(screen.getByText("Custom Title")).toBeDefined();
  });

  it("has role=status for accessibility", async () => {
    const { EmptyStateBlock } = await import("@/base/blocks/EmptyStateBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("empty_state", "test-empty-a11y", emptyStateData());

    render(
      <I18nProvider>
        <EmptyStateBlock block={descriptor} />
      </I18nProvider>,
    );

    // Both EmptyStateBlock wrapper and EmptyPlaceholder have role="status"
    expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
  });
});

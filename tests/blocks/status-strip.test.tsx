import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import "../setup";

import { block, statusStripData } from "../helpers";

describe("StatusStripBlock", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders item labels and values", async () => {
    const { StatusStripBlock } = await import("@/base/blocks/StatusStripBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("status_strip", "test-status", statusStripData());

    render(
      <I18nProvider>
        <StatusStripBlock block={descriptor} />
      </I18nProvider>,
    );

    expect(screen.getByText("Uptime")).toBeDefined();
    expect(screen.getByText("99.9%")).toBeDefined();
    expect(screen.getByText("Errors")).toBeDefined();
    expect(screen.getByText("3")).toBeDefined();
  });

  it("derives score item when score is present", async () => {
    const { StatusStripBlock } = await import("@/base/blocks/StatusStripBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("status_strip", "test-status-score", statusStripData());

    render(
      <I18nProvider>
        <StatusStripBlock block={descriptor} />
      </I18nProvider>,
    );

    expect(screen.getByText("Score")).toBeDefined();
    expect(screen.getByText("85%")).toBeDefined();
  });

  it("returns null when no items and no score", async () => {
    const { StatusStripBlock } = await import("@/base/blocks/StatusStripBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const data = { items: [] };
    const descriptor = block("status_strip", "test-status-empty", data);

    const { container } = render(
      <I18nProvider>
        <StatusStripBlock block={descriptor} />
      </I18nProvider>,
    );

    expect(container.innerHTML).toBe("");
  });
});

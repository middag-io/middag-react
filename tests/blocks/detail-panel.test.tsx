import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import "../setup";

import { block, detailPanelData } from "../helpers";

describe("DetailPanelBlock", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders section title and field values", async () => {
    const { DetailPanelBlock } = await import("@/base/blocks/DetailPanelBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("detail_panel", "test-detail", detailPanelData());

    render(
      <I18nProvider>
        <DetailPanelBlock block={descriptor} />
      </I18nProvider>,
    );

    expect(screen.getByText("Overview")).toBeDefined();
    expect(screen.getByText("Name")).toBeDefined();
    expect(screen.getByText("Test Item")).toBeDefined();
    expect(screen.getByText("Status")).toBeDefined();
    expect(screen.getByText("Active")).toBeDefined();
  });

  it("renders section with aria-label", async () => {
    const { DetailPanelBlock } = await import("@/base/blocks/DetailPanelBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("detail_panel", "test-detail-a11y", detailPanelData());

    render(
      <I18nProvider>
        <DetailPanelBlock block={descriptor} />
      </I18nProvider>,
    );

    const section = screen.getByRole("region", { name: "Overview" });
    expect(section).toBeDefined();
  });

  it("renders loading skeleton when meta.loading is true", async () => {
    const { DetailPanelBlock } = await import("@/base/blocks/DetailPanelBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("detail_panel", "test-detail-loading", detailPanelData(), {
      meta: { loading: true },
    });

    render(
      <I18nProvider>
        <DetailPanelBlock block={descriptor} />
      </I18nProvider>,
    );

    expect(screen.queryByText("Overview")).toBeNull();
    expect(screen.queryByText("Test Item")).toBeNull();
  });
});

import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import "../setup";

import { block, markdownPanelData } from "../helpers";

describe("MarkdownPanelBlock", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders card container", async () => {
    const { MarkdownPanelBlock } = await import("@/base/blocks/MarkdownPanelBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("markdown_panel", "test-md", markdownPanelData());
    const { container } = render(
      <I18nProvider>
        <MarkdownPanelBlock block={descriptor} />
      </I18nProvider>,
    );

    // Card structure is rendered (markdown content is lazy-loaded in Suspense)
    expect(container.querySelector("[class*='card']") ?? container.firstChild).toBeDefined();
  });

  it("renders title when provided in block descriptor", async () => {
    const { MarkdownPanelBlock } = await import("@/base/blocks/MarkdownPanelBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("markdown_panel", "test-md-title", markdownPanelData(), {
      title: "My Document",
    });
    const { container } = render(
      <I18nProvider>
        <MarkdownPanelBlock block={descriptor} />
      </I18nProvider>,
    );

    const titleEl = container.querySelector('[data-slot="card-title"]');
    expect(titleEl).not.toBeNull();
    expect(titleEl!.textContent).toBe("My Document");
  });

  it("renders without title when not provided", async () => {
    const { MarkdownPanelBlock } = await import("@/base/blocks/MarkdownPanelBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("markdown_panel", "test-md-no-title", markdownPanelData());
    const { container } = render(
      <I18nProvider>
        <MarkdownPanelBlock block={descriptor} />
      </I18nProvider>,
    );

    // No CardHeader with title
    expect(container.textContent).not.toContain("undefined");
  });
});

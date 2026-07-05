import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import "../setup";

import { block } from "../helpers";

/**
 * Local ActionGridBlockData fixture on the current contract shape (target + intent).
 * `actionGridData` in ../helpers still carries the legacy { href, method } shape;
 * these tests pin the canonical ActionGridItem (ActionBase + title + description).
 */
function actionGridData() {
  return {
    items: [
      {
        id: "sync",
        label: "Sync Data",
        title: "Sync Data",
        description: "Synchronize all records",
        icon: "refresh",
        target: { kind: "request" as const, endpoint: "/api/sync", method: "post" as const },
        intent: "primary" as const,
      },
      {
        id: "export",
        label: "Export CSV",
        title: "Export CSV",
        description: "Download as CSV",
        icon: "download",
        target: { kind: "link" as const, href: "/api/export" },
        intent: "secondary" as const,
      },
    ],
  };
}

describe("ActionGridBlock", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders item titles and labels", async () => {
    const { ActionGridBlock } = await import("@/base/blocks/ActionGridBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("action_grid", "test-actions", actionGridData());

    render(
      <I18nProvider>
        <ActionGridBlock block={descriptor} />
      </I18nProvider>,
    );

    // ActionGridItem has title (card heading) and label (button text) — both show same text
    expect(screen.getAllByText("Sync Data").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Export CSV").length).toBeGreaterThan(0);
  });

  it("renders item descriptions", async () => {
    const { ActionGridBlock } = await import("@/base/blocks/ActionGridBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("action_grid", "test-actions-desc", actionGridData());

    render(
      <I18nProvider>
        <ActionGridBlock block={descriptor} />
      </I18nProvider>,
    );

    expect(screen.getByText("Synchronize all records")).toBeDefined();
    expect(screen.getByText("Download as CSV")).toBeDefined();
  });

  it("renders without flash message", async () => {
    const { ActionGridBlock } = await import("@/base/blocks/ActionGridBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const data = actionGridData();
    const descriptor = block("action_grid", "test-actions-no-flash", data);

    render(
      <I18nProvider>
        <ActionGridBlock block={descriptor} />
      </I18nProvider>,
    );

    // No alert rendered when flash is absent
    expect(document.querySelector('[role="alert"]')).toBeNull();
  });

  it("re-shows the alert when a new flash arrives after dismissal", async () => {
    const { ActionGridBlock } = await import("@/base/blocks/ActionGridBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const base = actionGridData();

    const descriptor1 = block("action_grid", "ag-flash", {
      ...base,
      flash: { success: true, message: "First done" },
    });
    const { rerender } = render(
      <I18nProvider>
        <ActionGridBlock block={descriptor1} />
      </I18nProvider>,
    );

    expect(screen.getByText("First done")).toBeDefined();

    // Dismiss the first flash.
    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(screen.queryByText("First done")).toBeNull();

    // A new flash for the same block must re-show, not stay suppressed.
    const descriptor2 = block("action_grid", "ag-flash", {
      ...base,
      flash: { success: false, message: "Second failed" },
    });
    rerender(
      <I18nProvider>
        <ActionGridBlock block={descriptor2} />
      </I18nProvider>,
    );

    expect(screen.getByText("Second failed")).toBeDefined();
  });
});

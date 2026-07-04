/**
 * Action-execution wiring (Phase-0 adapter seam).
 *
 * The existing block tests cover render only. These cover the resolveActionTarget
 * wiring: clicking an action routes to the correct Inertia router call with the
 * resolved URL/method — the behaviour a browser smoke test would verify.
 */

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import "../setup";

import { block } from "../helpers";
import { mockRouter } from "../setup";

/**
 * Local ActionGridBlockData fixture on the current contract shape (target + intent).
 * `actionGridData` in ../helpers still carries the legacy { href, method } shape;
 * here we pin the canonical ActionGridItem so the execution-wiring assertions
 * (router.post for a request target, router.visit for a link target) stay honest.
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

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  cleanup();
});

async function renderWithI18n(node: React.ReactElement) {
  const { I18nProvider } = await import("@/i18n/I18nProvider");
  return render(<I18nProvider>{node}</I18nProvider>);
}

describe("ActionGridBlock — action execution", () => {
  it("routes a request item (method: post) through router.post with its href", async () => {
    const { ActionGridBlock } = await import("@/base/blocks/ActionGridBlock");
    await renderWithI18n(<ActionGridBlock block={block("action_grid", "ag1", actionGridData())} />);

    fireEvent.click(screen.getByRole("button", { name: "Sync Data" }));

    expect(mockRouter.post).toHaveBeenCalledWith("/api/sync");
    expect(mockRouter.visit).not.toHaveBeenCalled();
  });

  it("routes a navigation item (no method → link) through router.visit", async () => {
    const { ActionGridBlock } = await import("@/base/blocks/ActionGridBlock");
    await renderWithI18n(<ActionGridBlock block={block("action_grid", "ag2", actionGridData())} />);

    fireEvent.click(screen.getByRole("button", { name: "Export CSV" }));

    expect(mockRouter.visit).toHaveBeenCalledWith("/api/export");
    expect(mockRouter.post).not.toHaveBeenCalled();
  });
});

describe("DetailPanelBlock — section action execution", () => {
  function detailWithActions() {
    return {
      sections: [
        {
          id: "overview",
          title: "Overview",
          fields: [{ key: "name", label: "Name", value: "Test" }],
          actions: [
            {
              id: "save",
              label: "Save",
              target: { kind: "request" as const, endpoint: "/api/save", method: "post" as const },
              intent: "primary" as const,
            },
            {
              id: "remove",
              label: "Remove",
              target: {
                kind: "request" as const,
                endpoint: "/api/remove",
                method: "delete" as const,
              },
              intent: "danger" as const,
            },
          ],
        },
      ],
    };
  }

  it("routes a post action through router.post", async () => {
    const { DetailPanelBlock } = await import("@/base/blocks/DetailPanelBlock");
    await renderWithI18n(
      <DetailPanelBlock block={block("detail_panel", "dp1", detailWithActions())} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(mockRouter.post).toHaveBeenCalledWith("/api/save", {}, { preserveState: true });
  });

  it("routes a delete action through router.delete", async () => {
    const { DetailPanelBlock } = await import("@/base/blocks/DetailPanelBlock");
    await renderWithI18n(
      <DetailPanelBlock block={block("detail_panel", "dp2", detailWithActions())} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Remove" }));

    expect(mockRouter.delete).toHaveBeenCalledWith("/api/remove", { preserveState: true });
  });
});

describe("DenseTableBlock — row action execution (interpolate preserved)", () => {
  function tableWithRowAction() {
    return {
      columns: [{ key: "name", label: "Name" }],
      rows: [{ id: 7, name: "Alice" }],
      pagination: { page: 1, perPage: 10, total: 1, lastPage: 1 },
      sort: { column: null, direction: null },
      filters: { available: [], applied: {} },
      rowActions: [
        {
          id: "del",
          label: "Delete",
          target: {
            kind: "request" as const,
            endpoint: "/items/{id}/delete",
            method: "delete" as const,
          },
          intent: "danger" as const,
        },
      ],
    };
  }

  it("interpolates {id} per row and routes through router.delete", async () => {
    const { DenseTableBlock } = await import("@/base/blocks/DenseTableBlock");
    await renderWithI18n(
      <DenseTableBlock block={block("dense_table", "dt1", tableWithRowAction())} />,
    );

    // Inline row action renders as an icon Button with title={label} (its accessible name).
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(mockRouter.delete).toHaveBeenCalledWith("/items/7/delete", {
      preserveState: true,
      only: ["dt1"],
    });
  });
});

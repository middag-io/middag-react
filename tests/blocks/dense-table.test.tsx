import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import "../setup";

import { block, denseTableData } from "../helpers";

vi.mock("@/base/shell/partials/InspectorContext", () => ({
  useInspector: () => ({ select: vi.fn(), selectedId: null, enabled: false }),
}));

vi.mock("@/base/hooks/usePolling", () => ({
  usePolling: vi.fn(),
}));

describe("DenseTableBlock", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders column headers", async () => {
    const { DenseTableBlock } = await import("@/base/blocks/DenseTableBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("dense_table", "test-table", denseTableData());

    render(
      <I18nProvider>
        <DenseTableBlock block={descriptor} />
      </I18nProvider>,
    );

    expect(screen.getByText("Name")).toBeDefined();
    expect(screen.getByText("Email")).toBeDefined();
  });

  it("renders sortable headers as keyboard-operable buttons", async () => {
    const { DenseTableBlock } = await import("@/base/blocks/DenseTableBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("dense_table", "test-table-sortable-header", denseTableData());

    const { container } = render(
      <I18nProvider>
        <DenseTableBlock block={descriptor} />
      </I18nProvider>,
    );

    expect(screen.getByRole("button", { name: /Name/ })).toBeDefined();
    expect(container.querySelector("th[scope='col']")).toBeTruthy();
  });

  it("renders row data", async () => {
    const { DenseTableBlock } = await import("@/base/blocks/DenseTableBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("dense_table", "test-table-rows", denseTableData());

    render(
      <I18nProvider>
        <DenseTableBlock block={descriptor} />
      </I18nProvider>,
    );

    expect(screen.getByText("Alice")).toBeDefined();
    expect(screen.getByText("alice@example.com")).toBeDefined();
  });

  it("renders the column visibility toggle when columns are hideable", async () => {
    const { DenseTableBlock } = await import("@/base/blocks/DenseTableBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("dense_table", "test-table-colvis", denseTableData());

    render(
      <I18nProvider>
        <DenseTableBlock block={descriptor} />
      </I18nProvider>,
    );

    // Toolbar exposes a "Columns" toggle because the default columns are hideable.
    expect(screen.getByLabelText("Columns")).toBeDefined();
  });

  it("renders loading state when meta.loading is true", async () => {
    const { DenseTableBlock } = await import("@/base/blocks/DenseTableBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("dense_table", "test-table-loading", denseTableData(), {
      meta: { loading: true },
    });

    render(
      <I18nProvider>
        <DenseTableBlock block={descriptor} />
      </I18nProvider>,
    );

    // Headers should still be present; rows might show skeleton
    expect(screen.getByText("Name")).toBeDefined();
  });

  it("opens a confirmation dialog for bulk actions that declare confirmation", async () => {
    const { DenseTableBlock } = await import("@/base/blocks/DenseTableBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const data = {
      ...denseTableData(),
      bulkActions: [
        {
          id: "archive",
          label: "Archive",
          intent: "secondary" as const,
          target: {
            kind: "request" as const,
            endpoint: "/x/bulk/archive",
            method: "post" as const,
          },
          confirmation: {
            title: "Archive courses",
            message: "Archive the selected courses?",
            variant: "danger" as const,
          },
        },
      ],
    };
    const descriptor = block("dense_table", "test-table-bulk", data);

    render(
      <I18nProvider>
        <DenseTableBlock block={descriptor} />
      </I18nProvider>,
    );

    // Arm the bulk bar by selecting rows (the first checkbox is select-all).
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[0]);

    // The bulk "Archive" button appears once rows are selected.
    const archiveBtn = await screen.findByRole("button", { name: /Archive/ });
    fireEvent.click(archiveBtn);

    // The confirmation dialog opens instead of dispatching the request silently.
    expect(await screen.findByRole("dialog")).toBeDefined();
    expect(screen.getByText("Archive the selected courses?")).toBeDefined();
  });

  it("sends a cleared filter as an empty value instead of dropping the key", async () => {
    const { DenseTableBlock } = await import("@/base/blocks/DenseTableBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const { mockRouter } = await import("../setup");

    const data = {
      ...denseTableData(),
      filters: {
        available: [
          {
            key: "status",
            label: "Status",
            type: "select" as const,
            options: [{ value: "active", label: "Active" }],
          },
        ],
        applied: { status: "active" },
      },
    };

    render(
      <I18nProvider>
        <DenseTableBlock block={block("dense_table", "test-table-filter-clear", data)} />
      </I18nProvider>,
    );

    mockRouter.get.mockClear();
    fireEvent.click(screen.getByRole("button", { name: /Remove filter Status/ }));

    // The request is a partial patch merged onto the query the server already
    // holds. Omitting the key reads as "no opinion" and leaves the old value in
    // place, so the only active filter could never be cleared.
    const params = mockRouter.get.mock.calls[0][1] as Record<string, unknown>;
    expect(params["filter[status]"]).toBe("");
  });

  it("hides the save-as-view control until the contract declares its action", async () => {
    const { DenseTableBlock } = await import("@/base/blocks/DenseTableBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");

    const { rerender } = render(
      <I18nProvider>
        <DenseTableBlock block={block("dense_table", "test-table-no-star", denseTableData())} />
      </I18nProvider>,
    );

    // No action, no button — it used to render always, with no onClick at all.
    expect(screen.queryByRole("button", { name: /Save as view/ })).toBeNull();

    const withAction = {
      ...denseTableData(),
      saveViewAction: {
        id: "fav",
        label: "Favorite this view",
        intent: "secondary" as const,
        target: { kind: "request" as const, endpoint: "/x/fav", method: "post" as const },
      },
      saveViewActive: true,
    };
    rerender(
      <I18nProvider>
        <DenseTableBlock block={block("dense_table", "test-table-star", withAction)} />
      </I18nProvider>,
    );

    // The action's own label names the control, and the active state is exposed.
    const star = screen.getByRole("button", { name: "Favorite this view" });
    expect(star.getAttribute("aria-pressed")).toBe("true");
  });

  it("caps a column at maxWidth and keeps the full value in the title", async () => {
    const { DenseTableBlock } = await import("@/base/blocks/DenseTableBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");

    const long = "A".repeat(200);
    const base = denseTableData();
    const data = {
      ...base,
      columns: [{ key: "name", label: "Name", maxWidth: 300 }, ...base.columns.slice(1)],
      rows: [
        { id: 1, name: long, email: "a@b.c", status: { label: "Active", appearance: "success" } },
      ],
    };

    const { container } = render(
      <I18nProvider>
        <DenseTableBlock block={block("dense_table", "test-table-maxwidth", data)} />
      </I18nProvider>,
    );

    const text = container.querySelector("tbody span[title]") as HTMLElement | null;
    expect(text).not.toBeNull();
    // Clipped in CSS, not shortened in the data: the whole value is still here.
    expect(text!.getAttribute("title")).toBe(long);
    expect(text!.textContent).toBe(long);

    // The cap sits on the cell and the text fills it. Held on the text instead,
    // the column still claimed its share of any surplus table width while the
    // clipped value stayed pinned to the cap — a growing gap before the next
    // column, 170px of it at 1920.
    const td = text!.closest("td") as HTMLElement;
    expect(td.style.maxWidth).toBe("300px");
    expect(text!.className).toContain("w-full");
    expect(text!.className).toContain("truncate");

    // The header is bounded too, so the column cannot outgrow the cap.
    const th = container.querySelectorAll("thead th")[0] as HTMLElement;
    expect(th.style.maxWidth).toBe("300px");
  });
});

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
});

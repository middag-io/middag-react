import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import "../setup";

import { block, cardGridData, denseTableData } from "../helpers";

vi.mock("@/base/shell/partials/InspectorContext", () => ({
  useInspector: () => ({ select: vi.fn(), selectedId: null, enabled: false }),
}));

vi.mock("@/base/hooks/usePolling", () => ({
  usePolling: vi.fn(),
}));

// PHP encodes an empty map as `[]`; the wire contract accepts it for rows,
// filters, filters.applied and statusMap, and the blocks render it as empty.
describe("block data sent with empty PHP maps", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders a dense table whose filters, applied values and statusMap are []", async () => {
    const { DenseTableBlock } = await import("@/base/blocks/DenseTableBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const base = denseTableData();
    const descriptor = block("dense_table", "php-empty-table", {
      ...base,
      columns: base.columns.map((column) => ({ ...column, statusMap: [] as [] })),
      rows: [...base.rows, [] as []],
      filters: [] as [],
    });

    render(
      <I18nProvider>
        <DenseTableBlock block={descriptor} />
      </I18nProvider>,
    );

    expect(screen.getByText("Name")).toBeDefined();
    expect(screen.getByText(String(base.rows[0].name))).toBeDefined();
  });

  it("renders a dense table whose applied filters are []", async () => {
    const { DenseTableBlock } = await import("@/base/blocks/DenseTableBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("dense_table", "php-empty-applied", {
      ...denseTableData(),
      filters: { available: [], applied: [] as [] },
    });

    render(
      <I18nProvider>
        <DenseTableBlock block={descriptor} />
      </I18nProvider>,
    );

    expect(screen.getByText("Email")).toBeDefined();
  });

  it("renders a card grid with an empty-list row", async () => {
    const { CardGridBlock } = await import("@/base/blocks/CardGridBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const base = cardGridData();
    const descriptor = block("card_grid", "php-empty-cards", {
      ...base,
      rows: [...base.rows, [] as []],
    });

    render(
      <I18nProvider>
        <CardGridBlock block={descriptor} />
      </I18nProvider>,
    );

    expect(screen.getAllByText(String(base.rows[0].name)).length).toBeGreaterThan(0);
  });
});

describe("open enum values the renderer does not know", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders an empty state with an unknown variant", async () => {
    const { EmptyStateBlock } = await import("@/base/blocks/EmptyStateBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("empty_state", "unknown-variant", {
      variant: "maintenance",
      description: "Back soon",
    });

    render(
      <I18nProvider>
        <EmptyStateBlock block={descriptor} />
      </I18nProvider>,
    );

    expect(screen.getByText("Back soon")).toBeDefined();
  });

  it("infers the delta direction when the sent one is unknown", async () => {
    const { MetricCardBlock } = await import("@/base/blocks/MetricCardBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("metric_card", "unknown-direction", {
      value: 10,
      label: "Open",
      delta: "-3",
      deltaDirection: "sideways",
    });

    const { container } = render(
      <I18nProvider>
        <MetricCardBlock block={descriptor} />
      </I18nProvider>,
    );

    expect(container.querySelector(".text-destructive")).toBeTruthy();
  });
});

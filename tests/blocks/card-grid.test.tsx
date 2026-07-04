import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import "../setup";

import { block, cardGridData } from "../helpers";

// Mutable inspector state so individual tests can toggle enabled/selectedId.
// The `mock` prefix is required for vitest to allow referencing it inside the
// hoisted vi.mock factory.
const mockSelect = vi.fn();
const mockInspector: {
  select: typeof mockSelect;
  selectedId: string | number | null;
  enabled: boolean;
} = {
  select: mockSelect,
  selectedId: null,
  enabled: false,
};

vi.mock("@/base/shell/partials/InspectorContext", () => ({
  useInspector: () => mockInspector,
}));

describe("CardGridBlock", () => {
  afterEach(() => {
    cleanup();
    mockSelect.mockReset();
    mockInspector.selectedId = null;
    mockInspector.enabled = false;
  });

  it("renders item names from rows", async () => {
    const { CardGridBlock } = await import("@/base/blocks/CardGridBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("card_grid", "test-cards", cardGridData());

    render(
      <I18nProvider>
        <CardGridBlock block={descriptor} />
      </I18nProvider>,
    );

    // Item name appears in both h3 and column value, so use getAllByText
    expect(screen.getAllByText("Item One").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Item Two").length).toBeGreaterThan(0);
  });

  it("renders column labels in default variant", async () => {
    const { CardGridBlock } = await import("@/base/blocks/CardGridBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("card_grid", "test-cards-cols", cardGridData());

    render(
      <I18nProvider>
        <CardGridBlock block={descriptor} />
      </I18nProvider>,
    );

    // Status column rendered as key-value pair
    expect(screen.getAllByText("Status").length).toBeGreaterThan(0);
  });

  it("renders empty state when rows are empty and emptyState provided", async () => {
    const { CardGridBlock } = await import("@/base/blocks/CardGridBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const data = {
      ...cardGridData(),
      rows: [],
      emptyState: {
        title: "No cards yet",
        description: "Create your first card",
      },
    };
    const descriptor = block("card_grid", "test-cards-empty", data);

    render(
      <I18nProvider>
        <CardGridBlock block={descriptor} />
      </I18nProvider>,
    );

    expect(screen.getByText("No cards yet")).toBeDefined();
    expect(screen.getByText("Create your first card")).toBeDefined();
  });

  it("selects rows by string/UUID id without numeric coercion", async () => {
    mockInspector.enabled = true;
    mockInspector.selectedId = "uuid-2";

    const { CardGridBlock } = await import("@/base/blocks/CardGridBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const data = {
      ...cardGridData(),
      rows: [
        { id: "uuid-1", name: "Item One", status: "Active" },
        { id: "uuid-2", name: "Item Two", status: "Inactive" },
      ],
    };
    const descriptor = block("card_grid", "test-cards-strid", data);

    render(
      <I18nProvider>
        <CardGridBlock block={descriptor} />
      </I18nProvider>,
    );

    const buttons = screen.getAllByRole("button");

    // The selected card (uuid-2) carries the ring highlight — proves
    // `selectedId === id` matches string ids, not a coerced NaN.
    const selected = buttons.find((b) => b.className.includes("ring-2"));
    expect(selected?.textContent).toContain("Item Two");

    // Clicking the first card selects with the verbatim string id, not
    // Number("uuid-1") === NaN (the F-26 regression).
    fireEvent.click(buttons[0]);
    expect(mockSelect).toHaveBeenCalledWith("uuid-1");
  });

  it("does not select rows that have no id", async () => {
    mockInspector.enabled = true;

    const { CardGridBlock } = await import("@/base/blocks/CardGridBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const data = {
      ...cardGridData(),
      rows: [{ name: "No Id Item", status: "Active" }],
    };
    const descriptor = block("card_grid", "test-cards-noid", data);

    render(
      <I18nProvider>
        <CardGridBlock block={descriptor} />
      </I18nProvider>,
    );

    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(mockSelect).not.toHaveBeenCalled();
  });
});

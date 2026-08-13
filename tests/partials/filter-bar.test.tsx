/**
 * The two `FilterDef` types that had no control under them.
 *
 * `multiselect` and `date_range` were both in the union from the start and
 * neither was drawn: a consumer that asked for one got a label with nothing
 * below it and a filter nobody could set. Each type is its own branch, so
 * fixing one says nothing about the other — hence a test per branch.
 */

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import "../setup";

import type { AppliedFilters, FilterDef } from "@/base/partials/FilterBar";

type ApplySpy = ReturnType<typeof vi.fn<(key: string, value: string | string[]) => void>>;
type RemoveSpy = ReturnType<typeof vi.fn<(key: string) => void>>;

async function open(
  filters: FilterDef[],
  applied: AppliedFilters,
  handlers: { onApply?: ApplySpy; onRemove?: RemoveSpy } = {},
) {
  const { FilterBar } = await import("@/base/partials/FilterBar");
  const { I18nProvider } = await import("@/i18n/I18nProvider");

  render(
    <I18nProvider>
      <FilterBar
        filters={filters}
        applied={applied}
        onApply={handlers.onApply ?? vi.fn()}
        onRemove={handlers.onRemove ?? vi.fn()}
        onClearAll={vi.fn()}
      />
    </I18nProvider>,
  );
  fireEvent.click(screen.getByRole("button", { expanded: false }));
}

const MULTI: FilterDef[] = [
  {
    key: "status",
    label: "Status",
    type: "multiselect",
    options: [
      { value: "open", label: "Open" },
      { value: "done", label: "Done" },
    ],
  },
];

const RANGE: FilterDef[] = [{ key: "issued", label: "Issued", type: "date_range" }];

describe("FilterBar", () => {
  afterEach(() => {
    cleanup();
  });

  it("draws a checkbox per option for a multiselect", async () => {
    await open(MULTI, {});
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
  });

  it("adds to the selection instead of replacing it", async () => {
    const onApply: ApplySpy = vi.fn();
    await open(MULTI, { status: ["open"] }, { onApply });

    fireEvent.click(screen.getByText("Done"));
    expect(onApply).toHaveBeenCalledWith("status", ["open", "done"]);
  });

  it("removes the filter when the last value is unchecked", async () => {
    const onApply: ApplySpy = vi.fn();
    const onRemove: RemoveSpy = vi.fn();
    await open(MULTI, { status: ["open"] }, { onApply, onRemove });

    fireEvent.click(screen.getByText("Open"));
    // An empty list would read as "match nothing" and empty the table.
    expect(onRemove).toHaveBeenCalledWith("status");
    expect(onApply).not.toHaveBeenCalled();
  });

  it("draws both ends of a date range", async () => {
    await open(RANGE, {});
    const inputs = screen.getAllByLabelText(/^Issued /);
    expect(inputs).toHaveLength(2);
    expect(inputs.every((input) => input.getAttribute("type") === "date")).toBe(true);
  });

  it("keeps the empty end in place so position still says which end it is", async () => {
    const onApply: ApplySpy = vi.fn();
    await open(RANGE, {}, { onApply });

    fireEvent.change(screen.getAllByLabelText(/^Issued /)[1]!, {
      target: { value: "2026-03-01" },
    });
    expect(onApply).toHaveBeenCalledWith("issued", ["", "2026-03-01"]);
  });

  it("removes the filter when both ends are cleared", async () => {
    const onApply: ApplySpy = vi.fn();
    const onRemove: RemoveSpy = vi.fn();
    await open(RANGE, { issued: ["2026-03-01", ""] }, { onApply, onRemove });

    fireEvent.change(screen.getAllByLabelText(/^Issued /)[0]!, { target: { value: "" } });
    expect(onRemove).toHaveBeenCalledWith("issued");
    expect(onApply).not.toHaveBeenCalled();
  });
});

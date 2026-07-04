import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import "../setup";

import { DataTable } from "@/base/partials/DataTable";
import type {
  DataTableBulkAction,
  DataTableColumn,
  DataTableFilterDef,
} from "@/base/partials/DataTable/types";
import { I18nProvider } from "@/i18n/I18nProvider";

// DataTable picks the mobile card view vs desktop table from
// matchMedia("(max-width: 767px)"). The shared setup mocks matches:false;
// override per describe to drive each layout.
function setMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

type Row = { id: string; name: string; email: string };

const columns: DataTableColumn<Row>[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
];

const rows: Row[] = [
  { id: "u1", name: "Alice", email: "alice@example.com" },
  { id: "u2", name: "Bob", email: "bob@example.com" },
];

describe("DataTable mobile card view (F-28)", () => {
  beforeEach(() => setMatchMedia(true));
  afterEach(() => cleanup());

  it("fires onRowClick when a card is tapped", () => {
    const onRowClick = vi.fn();
    render(
      <I18nProvider>
        <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} onRowClick={onRowClick} />
      </I18nProvider>,
    );

    fireEvent.click(screen.getByText("Alice"));
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick).toHaveBeenCalledWith(rows[0]);
  });

  it("hides the selection checkbox when there are no bulk actions", () => {
    render(
      <I18nProvider>
        <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} onRowClick={vi.fn()} />
      </I18nProvider>,
    );

    expect(screen.queryByLabelText("Select row")).toBeNull();
  });

  it("shows a checkbox per card with bulk actions and tapping it does not fire onRowClick", () => {
    const onRowClick = vi.fn();
    // hasBulkActions only checks length > 0; the action shape is irrelevant here.
    const bulkActions = [{ id: "delete", label: "Delete" }] as unknown as DataTableBulkAction[];

    render(
      <I18nProvider>
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(r) => r.id}
          onRowClick={onRowClick}
          bulkActions={bulkActions}
        />
      </I18nProvider>,
    );

    const checkboxes = screen.getAllByLabelText("Select row");
    expect(checkboxes).toHaveLength(2);

    // Tapping the checkbox toggles selection but must not bubble to the card's
    // onRowClick (stopPropagation), mirroring the desktop row behavior.
    fireEvent.click(checkboxes[0]);
    expect(onRowClick).not.toHaveBeenCalled();
  });
});

describe("DataTable toolbar controls (F-30)", () => {
  beforeEach(() => setMatchMedia(false));
  afterEach(() => cleanup());

  it("labels density buttons with aria-label and aria-pressed", () => {
    render(
      <I18nProvider>
        <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} />
      </I18nProvider>,
    );

    const compact = screen.getByRole("button", { name: "Compact" });
    const comfortable = screen.getByRole("button", { name: "Comfortable" });
    // Default density is "comfortable" → it alone reports aria-pressed.
    expect(comfortable.getAttribute("aria-pressed")).toBe("true");
    expect(compact.getAttribute("aria-pressed")).toBe("false");

    fireEvent.click(compact);
    expect(compact.getAttribute("aria-pressed")).toBe("true");
    expect(comfortable.getAttribute("aria-pressed")).toBe("false");
  });

  it("exposes the save-view control with an accessible name", () => {
    render(
      <I18nProvider>
        <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} />
      </I18nProvider>,
    );

    expect(screen.getByRole("button", { name: "Save as view" })).toBeDefined();
  });

  it("renders filter removal as a keyboard-operable button, not a span", () => {
    const onParamChange = vi.fn();
    const filters = [
      {
        key: "status",
        label: "Status",
        type: "select",
        options: [{ value: "active", label: "Active" }],
      },
    ] as unknown as DataTableFilterDef[];

    render(
      <I18nProvider>
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(r) => r.id}
          filters={filters}
          appliedFilters={{ status: "active" }}
          onParamChange={onParamChange}
        />
      </I18nProvider>,
    );

    const removeBtn = screen.getByRole("button", { name: "Remove filter Status" });
    fireEvent.click(removeBtn);
    expect(onParamChange).toHaveBeenCalledWith({ filters: {}, page: 0 });
  });
});

describe("DataTable server param changes (F-29)", () => {
  beforeEach(() => setMatchMedia(false));
  afterEach(() => cleanup());

  const sortableColumns: DataTableColumn<Row>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email" },
  ];

  it("emits a sort param when a sortable header is clicked", () => {
    const onParamChange = vi.fn();
    render(
      <I18nProvider>
        <DataTable
          columns={sortableColumns}
          rows={rows}
          rowKey={(r) => r.id}
          onParamChange={onParamChange}
        />
      </I18nProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: /Name/ }));
    expect(onParamChange).toHaveBeenCalledWith({ sort: { key: "name", direction: "asc" } });
  });

  it("emits the next page index when paging forward", () => {
    const onParamChange = vi.fn();
    render(
      <I18nProvider>
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(r) => r.id}
          pagination={{ page: 0, perPage: 10, total: 30 }}
          onParamChange={onParamChange}
        />
      </I18nProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onParamChange).toHaveBeenCalledWith({ page: 1 });
  });

  it("emits perPage and resets to page 0 when the page size changes", () => {
    const onParamChange = vi.fn();
    render(
      <I18nProvider>
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(r) => r.id}
          pagination={{ page: 0, perPage: 10, total: 30 }}
          onParamChange={onParamChange}
        />
      </I18nProvider>,
    );

    fireEvent.change(screen.getByLabelText("Rows per page"), { target: { value: "25" } });
    expect(onParamChange).toHaveBeenCalledWith({ perPage: 25, page: 0 });
  });

  it("emits a debounced search param when typing in the search box", async () => {
    const onParamChange = vi.fn();
    render(
      <I18nProvider>
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(r) => r.id}
          onParamChange={onParamChange}
        />
      </I18nProvider>,
    );

    fireEvent.change(screen.getByPlaceholderText("Search..."), { target: { value: "ali" } });
    await waitFor(() => expect(onParamChange).toHaveBeenCalledWith({ search: "ali", page: 0 }));
  });
});

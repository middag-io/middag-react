import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import "../setup";

import { FormField } from "@/base/form/FormField";
import { BlockRegion } from "@/base/layout/BlockRegion";
import { ConfirmationDialog } from "@/base/partials/ConfirmationDialog";
import { DataTable } from "@/base/partials/DataTable";
import type { DataTableColumn, DataTableRowAction } from "@/base/partials/DataTable/types";
import type { FormFieldNode } from "@/contracts/block-data";
import type { BlockDescriptor } from "@/contracts/page-contract";
import { I18nProvider } from "@/i18n/I18nProvider";
import {
  actionTestId,
  blockTestId,
  fieldTestId,
  rowActionTestId,
  rowTestId,
  TEST_IDS,
} from "@/lib/test-ids";

/**
 * Acceptance tests (Moodle Behat, Playwright) find the engine's surfaces by
 * these ids. Each one comes from a contract identifier, never from a label.
 */

afterEach(() => cleanup());

describe("test id helpers", () => {
  it("derive every id from the contract identifier", () => {
    expect(blockTestId("users")).toBe("block-users");
    expect(actionTestId("create")).toBe("action-create");
    expect(fieldTestId("email")).toBe("field-email");
    expect(rowTestId(42)).toBe("row-42");
    expect(rowActionTestId("edit")).toBe("row-action-edit");
  });
});

describe("rendered test ids", () => {
  it("BlockRegion marks each block by its key", () => {
    const blocks = [
      { type: "x", key: "summary", data: {} },
      { type: "x", key: "users", data: {} },
    ] as unknown as BlockDescriptor[];

    render(<BlockRegion blocks={blocks} renderBlock={(b) => <p>{b.key} body</p>} />);

    expect(screen.getByTestId("block-summary")).toHaveTextContent("summary body");
    expect(screen.getByTestId("block-users")).toHaveTextContent("users body");
  });

  it("FormField marks the field wrapper by the field key", () => {
    const field: FormFieldNode = {
      kind: "field",
      key: "email",
      component: "text",
      props: { label: "E-mail" },
    };

    render(
      <I18nProvider>
        <FormField field={field} value="" onChange={() => {}} />
      </I18nProvider>,
    );

    const wrapper = screen.getByTestId("field-email");
    expect(within(wrapper).getByLabelText("E-mail")).toBeInTheDocument();
  });

  it("ConfirmationDialog marks the dialog and both buttons", () => {
    render(
      <I18nProvider>
        <ConfirmationDialog
          open
          onClose={() => {}}
          onConfirm={() => {}}
          title="Delete"
          message="Sure?"
        />
      </I18nProvider>,
    );

    const dialog = screen.getByTestId(TEST_IDS.confirmDialog);
    expect(within(dialog).getByTestId(TEST_IDS.confirmDialogConfirm)).toBeInTheDocument();
    expect(within(dialog).getByTestId(TEST_IDS.confirmDialogCancel)).toBeInTheDocument();
  });

  it("DataTable marks rows by their key and row actions by their id", () => {
    type Row = { id: string; name: string };
    const columns: DataTableColumn<Row>[] = [{ key: "name", label: "Name" }];
    const rows: Row[] = [
      { id: "u1", name: "Alice" },
      { id: "u2", name: "Bob" },
    ];
    const action = (id: string): DataTableRowAction<Row> => ({
      id,
      label: id,
      variant: "button",
      onAction: vi.fn(),
    });

    render(
      <I18nProvider>
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(r) => r.id}
          rowActions={[action("edit"), action("view"), action("delete")]}
        />
      </I18nProvider>,
    );

    const row = screen.getByTestId("row-u2");
    expect(row).toHaveTextContent("Bob");
    expect(within(row).getByTestId("row-action-edit")).toBeInTheDocument();
    expect(within(row).getByTestId("row-action-view")).toBeInTheDocument();
    // The third action lives in the overflow menu, behind its trigger.
    expect(within(row).getByTestId(TEST_IDS.rowActionsMenu)).toBeInTheDocument();
  });
});

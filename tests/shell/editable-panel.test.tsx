/**
 * InlineEditablePanel — the free editable-panel primitive's renderer.
 *
 * Drives the renderer through an injected EditablePanelContext value (the
 * provider's fetch/submit transport is exercised separately). Verifies the
 * descriptor's form renders, a valid save calls submit with the edited values,
 * and client-side validation blocks an invalid save.
 */

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import "../setup";

import type {
  EditablePanelContextValue,
  EditablePanelDescriptor,
} from "@/base/shell/partials/EditablePanelContext";
import type { FormSchemaNode } from "@/contracts/block-data";

const schema: FormSchemaNode[] = [
  {
    kind: "field",
    key: "fullname",
    component: "text",
    props: { label: "Form name", required: true },
  },
  {
    kind: "field",
    key: "status",
    component: "select",
    props: {
      label: "Status",
      options: [
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
      ],
    },
  },
];

const descriptor = (values: Record<string, unknown>): EditablePanelDescriptor => ({
  title: "Enrolment form",
  subtitle: "Settings",
  submitLabel: "Save",
  schema,
  values,
});

async function renderPanel(overrides: Partial<EditablePanelContextValue>) {
  const { EditablePanelContext } = await import("@/base/shell/partials/EditablePanelContext");
  const { InlineEditablePanel } = await import("@/base/shell/partials/InlineEditablePanel");
  const { I18nProvider } = await import("@/i18n/I18nProvider");

  const ctx: EditablePanelContextValue = {
    selectedId: "form-1",
    open: vi.fn(),
    close: vi.fn(),
    enabled: true,
    descriptor: descriptor({ fullname: "Enrolment form", status: "published" }),
    loading: false,
    saving: false,
    submit: vi.fn(),
    width: 440,
    ...overrides,
  };

  render(
    <I18nProvider>
      <EditablePanelContext.Provider value={ctx}>
        <InlineEditablePanel />
      </EditablePanelContext.Provider>
    </I18nProvider>,
  );

  return ctx;
}

describe("InlineEditablePanel", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders nothing when the context is disabled", async () => {
    await renderPanel({ enabled: false });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders nothing when no row is selected", async () => {
    await renderPanel({ selectedId: null });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders the descriptor's title and fields", async () => {
    await renderPanel({});
    expect(screen.getByRole("dialog")).toBeDefined();
    expect(screen.getByText("Enrolment form")).toBeDefined();
    expect(screen.getByText("Form name")).toBeDefined();
    expect(screen.getByText("Status")).toBeDefined();
  });

  it("submits the (validated) values on save", async () => {
    const ctx = await renderPanel({});
    fireEvent.click(screen.getByText("Save"));
    expect(ctx.submit).toHaveBeenCalledTimes(1);
    expect(ctx.submit).toHaveBeenCalledWith(
      expect.objectContaining({ fullname: "Enrolment form", status: "published" }),
    );
  });

  it("blocks save and does not submit when a required field is empty", async () => {
    const ctx = await renderPanel({
      descriptor: descriptor({ fullname: "", status: "draft" }),
    });
    fireEvent.click(screen.getByText("Save"));
    expect(ctx.submit).not.toHaveBeenCalled();
  });
});

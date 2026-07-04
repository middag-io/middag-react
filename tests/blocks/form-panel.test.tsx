import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import "../setup";

import type { FormPanelBlockData, FormSchemaNode } from "@/contracts/block-data";

import { block } from "../helpers";
import { mockRouter } from "../setup";

const formPanelData = (): FormPanelBlockData => ({
  action: "/api/settings",
  method: "put",
  schema: [
    {
      kind: "field",
      key: "site_name",
      component: "text",
      props: { label: "Site Name", placeholder: "My Site", required: true },
    },
    {
      kind: "field",
      key: "enable_feature",
      component: "switch",
      props: { label: "Enable Feature" },
    },
  ],
  values: { site_name: "Test Site", enable_feature: true },
  errors: {},
  meta: { submitLabel: "Save" },
});

describe("FormPanelBlock", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders form with submit button", async () => {
    const { FormPanelBlock } = await import("@/base/blocks/FormPanelBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("form_panel", "test-form", formPanelData());

    render(
      <I18nProvider>
        <FormPanelBlock block={descriptor} />
      </I18nProvider>,
    );

    // The submit button text comes from data.meta.submitLabel ("Save")
    // or the i18n fallback
    const form = screen.getByRole("form");
    expect(form).toBeDefined();
    expect(screen.getByText("Save")).toBeDefined();
  });

  it("renders field labels", async () => {
    const { FormPanelBlock } = await import("@/base/blocks/FormPanelBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("form_panel", "test-form-fields", formPanelData());

    render(
      <I18nProvider>
        <FormPanelBlock block={descriptor} />
      </I18nProvider>,
    );

    expect(screen.getByText("Site Name")).toBeDefined();
    expect(screen.getByText("Enable Feature")).toBeDefined();
  });

  it("renders cancel button", async () => {
    const { FormPanelBlock } = await import("@/base/blocks/FormPanelBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("form_panel", "test-form-cancel", formPanelData());

    render(
      <I18nProvider>
        <FormPanelBlock block={descriptor} />
      </I18nProvider>,
    );

    // Cancel button uses i18n key fallback
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(2); // Submit + Cancel
  });

  it("submits optional typed fields when the server omits initial values", async () => {
    const { FormPanelBlock } = await import("@/base/blocks/FormPanelBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const data: FormPanelBlockData = {
      action: "/api/profile",
      method: "post",
      schema: [
        {
          kind: "field",
          key: "name",
          component: "text",
          props: { label: "Name", required: true },
        },
        {
          kind: "field",
          key: "age",
          component: "int",
          props: { label: "Age" },
        },
        {
          kind: "field",
          key: "enabled",
          component: "switch",
          props: { label: "Enabled" },
        },
        {
          kind: "field",
          key: "tags",
          component: "tags",
          props: { label: "Tags" },
        },
      ],
      values: { name: "Alice" },
      errors: {},
      meta: { submitLabel: "Save", validation: "both" },
    };

    render(
      <I18nProvider>
        <FormPanelBlock block={block("form_panel", "typed-defaults", data)} />
      </I18nProvider>,
    );

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => expect(mockRouter.post).toHaveBeenCalledTimes(1));
    expect(mockRouter.post).toHaveBeenCalledWith(
      "/api/profile",
      expect.objectContaining({
        name: "Alice",
        age: null,
        enabled: false,
        tags: [],
      }),
      expect.any(Object),
    );
  });

  it("uses the current source field value when auto-generating slugs", async () => {
    const { FormPanelBlock } = await import("@/base/blocks/FormPanelBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const data: FormPanelBlockData = {
      action: "/api/posts",
      method: "post",
      schema: [
        {
          kind: "field",
          key: "title",
          component: "text",
          props: { label: "Title" },
        },
        {
          kind: "field",
          key: "slug",
          component: "slug",
          props: { label: "Slug", sourceField: "title" },
        },
      ],
      values: { title: "My First Post" },
      errors: {},
      meta: { submitLabel: "Save", validation: "both" },
    };

    render(
      <I18nProvider>
        <FormPanelBlock block={block("form_panel", "slug-source", data)} />
      </I18nProvider>,
    );

    await waitFor(() => expect(screen.getByLabelText("Slug")).toHaveValue("my-first-post"));
  });

  it("shows fields controlled by boolean visible_when conditions", async () => {
    const { FormPanelBlock } = await import("@/base/blocks/FormPanelBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const data: FormPanelBlockData = {
      action: "/api/settings",
      method: "post",
      schema: [
        {
          kind: "field",
          key: "email_notifications",
          component: "switch",
          props: { label: "Email notifications" },
        },
        {
          kind: "field",
          key: "notification_email",
          component: "email",
          props: {
            label: "Notification email",
            visible_when: { field: "email_notifications", operator: "equals", value: "true" },
          },
        },
      ],
      values: { email_notifications: true },
      errors: {},
      meta: { submitLabel: "Save", validation: "both" },
    };

    render(
      <I18nProvider>
        <FormPanelBlock block={block("form_panel", "visible-when", data)} />
      </I18nProvider>,
    );

    expect(screen.getByLabelText("Notification email")).toBeInTheDocument();
  });

  it("blocks submit when required_when makes an empty field required", async () => {
    const { FormPanelBlock } = await import("@/base/blocks/FormPanelBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const data: FormPanelBlockData = {
      action: "/api/tickets",
      method: "post",
      schema: [
        {
          kind: "field",
          key: "escalate",
          component: "switch",
          props: { label: "Escalate" },
        },
        {
          kind: "field",
          key: "reason",
          component: "text",
          props: {
            label: "Reason",
            required_when: { field: "escalate", operator: "equals", value: "true" },
          },
        },
      ],
      values: { escalate: true },
      errors: {},
      meta: { submitLabel: "Save", validation: "both" },
    };

    render(
      <I18nProvider>
        <FormPanelBlock block={block("form_panel", "required-when-block", data)} />
      </I18nProvider>,
    );

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() =>
      expect(screen.getByLabelText(/Reason/)).toHaveAttribute("aria-invalid", "true"),
    );
    expect(mockRouter.post).not.toHaveBeenCalled();
  });

  it("allows submit when required_when does not apply", async () => {
    const { FormPanelBlock } = await import("@/base/blocks/FormPanelBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const data: FormPanelBlockData = {
      action: "/api/tickets",
      method: "post",
      schema: [
        {
          kind: "field",
          key: "escalate",
          component: "switch",
          props: { label: "Escalate" },
        },
        {
          kind: "field",
          key: "reason",
          component: "text",
          props: {
            label: "Reason",
            required_when: { field: "escalate", operator: "equals", value: "true" },
          },
        },
      ],
      values: { escalate: false },
      errors: {},
      meta: { submitLabel: "Save", validation: "both" },
    };

    render(
      <I18nProvider>
        <FormPanelBlock block={block("form_panel", "required-when-pass", data)} />
      </I18nProvider>,
    );

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => expect(mockRouter.post).toHaveBeenCalledTimes(1));
  });

  it("disables a field when disabled_when matches current values", async () => {
    const { FormPanelBlock } = await import("@/base/blocks/FormPanelBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const data: FormPanelBlockData = {
      action: "/api/jobs",
      method: "post",
      schema: [
        {
          kind: "field",
          key: "auto",
          component: "switch",
          props: { label: "Auto schedule" },
        },
        {
          kind: "field",
          key: "note",
          component: "text",
          props: {
            label: "Note",
            disabled_when: { field: "auto", operator: "equals", value: "true" },
          },
        },
      ],
      values: { auto: true },
      errors: {},
      meta: { submitLabel: "Save", validation: "both" },
    };

    render(
      <I18nProvider>
        <FormPanelBlock block={block("form_panel", "disabled-when", data)} />
      </I18nProvider>,
    );

    expect(screen.getByLabelText("Note")).toBeDisabled();
  });

  it("resets values when the server sends new initial values", async () => {
    const { FormPanelBlock } = await import("@/base/blocks/FormPanelBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const make = (values: Record<string, unknown>) =>
      block("form_panel", "reset-on-values", {
        action: "/api/profile",
        method: "post",
        schema: [{ kind: "field", key: "name", component: "text", props: { label: "Name" } }],
        values,
        errors: {},
        meta: { submitLabel: "Save", validation: "both" },
      } satisfies FormPanelBlockData);

    const { rerender } = render(
      <I18nProvider>
        <FormPanelBlock block={make({ name: "Alice" })} />
      </I18nProvider>,
    );

    await waitFor(() => expect(screen.getByLabelText("Name")).toHaveValue("Alice"));

    rerender(
      <I18nProvider>
        <FormPanelBlock block={make({ name: "Bob" })} />
      </I18nProvider>,
    );

    await waitFor(() => expect(screen.getByLabelText("Name")).toHaveValue("Bob"));
  });

  it("preserves in-progress edits when re-rendered with identical server values", async () => {
    const { FormPanelBlock } = await import("@/base/blocks/FormPanelBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const make = () =>
      block("form_panel", "reset-no-clobber", {
        action: "/api/profile",
        method: "post",
        schema: [{ kind: "field", key: "name", component: "text", props: { label: "Name" } }],
        values: { name: "Alice" },
        errors: {},
        meta: { submitLabel: "Save", validation: "both" },
      } satisfies FormPanelBlockData);

    const { rerender } = render(
      <I18nProvider>
        <FormPanelBlock block={make()} />
      </I18nProvider>,
    );

    const input = screen.getByLabelText("Name");
    await waitFor(() => expect(input).toHaveValue("Alice"));

    fireEvent.change(input, { target: { value: "Edited" } });
    await waitFor(() => expect(input).toHaveValue("Edited"));

    // New prop object, identical content — the serialized key is unchanged, so
    // the reset effect must not fire and clobber the in-progress edit.
    rerender(
      <I18nProvider>
        <FormPanelBlock block={make()} />
      </I18nProvider>,
    );

    expect(screen.getByLabelText("Name")).toHaveValue("Edited");
  });

  // Locks the F-23 "untouched existing file is preserved" guarantee: when a file
  // field is not touched, FileUploadField never fires onChange, so RHF keeps the
  // server-provided value and the submit payload sends it back verbatim. See
  // ADR-F23-multifile for why the wire shape is intentionally frozen.
  it("submits an untouched existing file value unchanged", async () => {
    const { FormPanelBlock } = await import("@/base/blocks/FormPanelBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const existing = {
      name: "doc.pdf",
      size: 1024,
      type: "application/pdf",
      url: "/files/doc.pdf",
      id: "f1",
    };
    const data: FormPanelBlockData = {
      action: "/api/record",
      method: "post",
      schema: [
        { kind: "field", key: "attachment", component: "file", props: { label: "Attachment" } },
      ],
      values: { attachment: existing },
      errors: {},
      meta: { submitLabel: "Save", validation: "both" },
    };

    render(
      <I18nProvider>
        <FormPanelBlock block={block("form_panel", "file-untouched", data)} />
      </I18nProvider>,
    );

    // Existing file is shown (F-23 display) without any interaction.
    expect(screen.getByText("doc.pdf")).toBeInTheDocument();

    fireEvent.submit(screen.getByRole("form"));

    await waitFor(() => expect(mockRouter.post).toHaveBeenCalledTimes(1));
    expect(mockRouter.post).toHaveBeenCalledWith(
      "/api/record",
      expect.objectContaining({ attachment: existing }),
      expect.any(Object),
    );
  });

  // ── F-31: form-level / non-field / dotted errors surfaced, not swallowed ──

  const twoFieldSchema: FormSchemaNode[] = [
    { kind: "field", key: "name", component: "text", props: { label: "Name" } },
    { kind: "field", key: "email", component: "email", props: { label: "Email" } },
  ];

  it("renders form-level, orphan and dotted errors in an alert region", async () => {
    const { FormPanelBlock } = await import("@/base/blocks/FormPanelBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const data: FormPanelBlockData = {
      action: "/api/x",
      method: "post",
      schema: twoFieldSchema,
      values: {},
      errors: {
        _: "Invalid request payload",
        "address.city": "City is required",
        widget: "Unknown widget",
      },
      meta: { submitLabel: "Save", validation: "both" },
    };

    render(
      <I18nProvider>
        <FormPanelBlock block={block("form_panel", "form-level-errors", data)} />
      </I18nProvider>,
    );

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Invalid request payload");
    expect(alert).toHaveTextContent("City is required"); // dotted key must NOT be dropped
    expect(alert).toHaveTextContent("Unknown widget");
  });

  it("renders a field-keyed error on the field, with no form-level alert", async () => {
    const { FormPanelBlock } = await import("@/base/blocks/FormPanelBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const data: FormPanelBlockData = {
      action: "/api/x",
      method: "post",
      schema: twoFieldSchema,
      values: {},
      errors: { email: "Bad email address" },
      meta: { submitLabel: "Save", validation: "both" },
    };

    render(
      <I18nProvider>
        <FormPanelBlock block={block("form_panel", "field-error-only", data)} />
      </I18nProvider>,
    );

    await waitFor(() => expect(screen.getByText("Bad email address")).toBeInTheDocument());
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("separates field errors from form-level errors without duplication", async () => {
    const { FormPanelBlock } = await import("@/base/blocks/FormPanelBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const data: FormPanelBlockData = {
      action: "/api/x",
      method: "post",
      schema: twoFieldSchema,
      values: {},
      errors: { email: "bad email", _: "form broke", "a.b": "nested broke" },
      meta: { submitLabel: "Save", validation: "both" },
    };

    render(
      <I18nProvider>
        <FormPanelBlock block={block("form_panel", "mixed-errors", data)} />
      </I18nProvider>,
    );

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("form broke");
    expect(alert).toHaveTextContent("nested broke");
    expect(alert).not.toHaveTextContent("bad email"); // field error not duplicated in alert
    expect(screen.getByText("bad email")).toBeInTheDocument(); // shown per-field
  });

  it("surfaces a non-field error returned by the submit (onError) in the alert", async () => {
    const { FormPanelBlock } = await import("@/base/blocks/FormPanelBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    mockRouter.post.mockImplementation(
      (_url: string, _data: unknown, opts: { onError?: (e: Record<string, unknown>) => void }) => {
        opts.onError?.({ server_problem: "boom" });
      },
    );
    const data: FormPanelBlockData = {
      action: "/api/x",
      method: "post",
      schema: [{ kind: "field", key: "name", component: "text", props: { label: "Name" } }],
      values: {},
      errors: {},
      meta: { submitLabel: "Save", validation: "both" },
    };

    render(
      <I18nProvider>
        <FormPanelBlock block={block("form_panel", "onerror-form-level", data)} />
      </I18nProvider>,
    );

    fireEvent.submit(screen.getByRole("form"));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("boom");
  });
});

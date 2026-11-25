/**
 * Accessibility gate: axe-core over the shell, DataTable, FormField and Badge.
 *
 * No serious or critical violation is allowed. A few behaviors axe cannot see
 * (skip link order, focus-revealed row actions, describedby targets) are
 * asserted directly.
 */

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

// Side-effect import first: registers the Inertia mocks before the components load.
import "../setup";

import { FormField, type FieldDescriptor } from "@/base/form/FormField";
import { DataTable } from "@/base/partials/DataTable";
import type { DataTableColumn, DataTableRowAction } from "@/base/partials/DataTable/types";
import { BasicShell } from "@/base/shell/BasicShell";
import { I18nProvider } from "@/i18n/I18nProvider";
import { Badge } from "@/primitives/reui/badge";

import { mockUsePage } from "../setup";
import { propsWithContract } from "../test-helpers";
import { blockingViolations } from "./axe-helpers";

afterEach(() => cleanup());

describe("BasicShell", () => {
  function renderShell(): void {
    // <html lang> and <title> belong to the host page that mounts the shell.
    document.documentElement.lang = "en";
    document.title = "Courses";
    mockUsePage.mockReturnValue({
      props: propsWithContract(
        {
          version: "2",
          shell: "basic",
          page: {
            key: "courses",
            title: "Courses",
            breadcrumbs: [{ label: "Home", href: "/" }, { label: "Courses" }],
            actions: [],
          },
          layout: { template: "stack", regions: {} },
        },
        {
          navigation: {
            tree: [
              { key: "home", label: "Home", href: "/" },
              {
                key: "admin",
                label: "Admin",
                children: [{ key: "courses", label: "Courses", href: "/courses" }],
              },
            ],
            footer: [],
            activeKey: "courses",
          },
        } as never,
      ),
      url: "/courses",
    });
    render(
      <I18nProvider>
        <BasicShell>
          <p>Page body</p>
        </BasicShell>
      </I18nProvider>,
    );
  }

  it("has no serious or critical axe violations", async () => {
    renderShell();
    await screen.findByText("Page body");

    expect(await blockingViolations(document)).toEqual([]);
  });

  it("starts with a skip link to the single main landmark", async () => {
    renderShell();
    await screen.findByText("Page body");

    const firstFocusable = document.querySelector<HTMLElement>(
      "a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex='-1'])",
    );
    expect(firstFocusable?.textContent).toBe("Skip to main content");
    expect(firstFocusable?.getAttribute("href")).toBe("#middag-main-content");

    const mains = screen.getAllByRole("main");
    expect(mains).toHaveLength(1);
    expect(mains[0].id).toBe("middag-main-content");
    expect(mains[0].getAttribute("tabindex")).toBe("-1");
  });

  it("exposes the page title as the level-1 heading", async () => {
    renderShell();

    expect(await screen.findByRole("heading", { level: 1, name: "Courses" })).toBeDefined();
  });
});

describe("DataTable", () => {
  type Row = { id: string; name: string; status: string };
  const columns: DataTableColumn<Row>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "status", label: "Status", type: "status" } as DataTableColumn<Row>,
  ];
  const rows: Row[] = [
    { id: "1", name: "Alice", status: "active" },
    { id: "2", name: "Bob", status: "pending" },
  ];
  const rowActions: DataTableRowAction<Row>[] = [
    { id: "edit", label: "Edit", icon: "edit", onAction: vi.fn() },
  ];

  function renderTable(): void {
    render(
      <I18nProvider>
        <DataTable columns={columns} rows={rows} rowKey={(r) => r.id} rowActions={rowActions} />
      </I18nProvider>,
    );
  }

  it("has no serious or critical axe violations", async () => {
    renderTable();
    await screen.findByText("Alice");

    expect(await blockingViolations(document.body)).toEqual([]);
  });

  it("is a plain table, not a grid without grid keyboard support", async () => {
    renderTable();
    await screen.findByText("Alice");

    expect(screen.queryByRole("grid")).toBeNull();
    expect(screen.getByRole("table")).toBeDefined();
  });

  it("reveals row actions when keyboard focus enters the row", async () => {
    renderTable();
    const [edit] = await screen.findAllByRole("button", { name: "Edit" });

    const wrapper = edit.closest("div.opacity-0");
    expect(wrapper?.className).toContain("focus-within:opacity-100");
    expect(wrapper?.className).toContain("group-focus-within/row:opacity-100");
  });
});

describe("FormField", () => {
  const fields: FieldDescriptor[] = [
    { key: "section", component: "header", props: { label: "Profile" } },
    {
      key: "name",
      component: "text",
      props: { label: "Name", helpText: "As shown on the certificate", required: true },
    },
    { key: "email", component: "email", props: { label: "Email" } },
    {
      key: "role",
      component: "select",
      props: {
        label: "Role",
        options: [
          { value: "student", label: "Student" },
          { value: "teacher", label: "Teacher" },
        ],
      },
    },
    { key: "notify", component: "checkbox", props: { label: "Notify me" } },
    { key: "bio", component: "textarea", props: { label: "Bio", helpText: "Optional" } },
  ] as FieldDescriptor[];

  function renderForm(errors: Record<string, string> = {}, headingLevel?: 2 | 3): void {
    render(
      <I18nProvider>
        <form aria-label="Profile">
          {fields.map((field) => (
            <FormField
              key={field.key}
              field={field}
              value={field.component === "checkbox" ? false : ""}
              onChange={vi.fn()}
              error={errors[field.key]}
              headingLevel={headingLevel}
            />
          ))}
        </form>
      </I18nProvider>,
    );
  }

  it("has no serious or critical axe violations, with and without errors", async () => {
    renderForm();
    expect(await blockingViolations(document.body)).toEqual([]);
    cleanup();

    renderForm({ name: "Name is required", email: "Invalid email" });
    expect(await blockingViolations(document.body)).toEqual([]);
  });

  it("points aria-describedby only at elements that are rendered", () => {
    renderForm({ email: "Invalid email" });

    const described = Array.from(document.querySelectorAll("[aria-describedby]"));
    expect(described.length).toBeGreaterThan(0);
    for (const element of described) {
      for (const id of element.getAttribute("aria-describedby")!.split(/\s+/)) {
        expect(document.getElementById(id), `#${id}`).not.toBeNull();
      }
    }
    // The email input (no help text) references its error and nothing else.
    expect(screen.getByLabelText("Email").getAttribute("aria-describedby")).toMatch(/-error$/);
  });

  it("renders the header at the requested level (default 4)", () => {
    renderForm();
    expect(screen.getByRole("heading", { level: 4, name: "Profile" })).toBeDefined();
    cleanup();

    renderForm({}, 3);
    expect(screen.getByRole("heading", { level: 3, name: "Profile" })).toBeDefined();
  });
});

describe("Badge", () => {
  const variants = [
    "default",
    "outline",
    "secondary",
    "info",
    "success",
    "warning",
    "destructive",
    "invert",
    "primary-light",
    "warning-light",
    "success-light",
    "info-light",
    "destructive-light",
    "invert-light",
    "primary-outline",
    "warning-outline",
    "success-outline",
    "info-outline",
    "destructive-outline",
    "invert-outline",
  ] as const;

  it("has no serious or critical axe violations in any variant", async () => {
    render(
      <div>
        {variants.map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
          </Badge>
        ))}
      </div>,
    );

    expect(await blockingViolations(document.body)).toEqual([]);
  });

  it("never hard-codes white text on a status fill", () => {
    render(
      <div>
        {variants.map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
          </Badge>
        ))}
      </div>,
    );

    for (const variant of variants) {
      expect(screen.getByText(variant).className, variant).not.toContain("text-white");
    }
  });
});

/**
 * Integration tests for the contract-driven rendering pipeline.
 *
 * Verifies the full flow: PageContract → ContractPage → Shell → Layout → Blocks.
 * Uses real registered components via registerDefaults() — no manual stubs.
 *
 * Mocks: Inertia (setup.ts), useInspector, usePolling, useErrorReporter.
 */

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import "../setup";

import type { PageContract } from "@/contracts/page-contract";
import { validatePageContract } from "@/contracts/page-contract-schema";

import loginGolden from "../fixtures/auth-login.golden.json";
import { mockUsePage } from "../setup";

// ── Mocks for block dependencies ──────────────────────────────────────────────

// DenseTableBlock reads inspector state
vi.mock("@/base/shell/partials/InspectorContext", () => ({
  useInspector: () => ({ inspect: vi.fn(), select: vi.fn(), selectedId: null, enabled: false }),
  InspectorProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// DenseTableBlock and other blocks use polling
vi.mock("@/base/hooks/usePolling", () => ({
  usePolling: vi.fn(),
}));

// NavErrorBoundary uses error reporter
vi.mock("@/app/providers/error-reporter", () => ({
  useErrorReporter: () => ({
    captureError: vi.fn(),
    captureMessage: vi.fn(),
  }),
  ErrorReporterProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// ── Shared usePage props factory ──────────────────────────────────────────────

function makePageProps(contract: Record<string, unknown>, extra?: Record<string, unknown>) {
  return {
    props: {
      auth: { id: 1, name: "Test User", email: "test@example.com", capabilities: [] },
      theme: { appearance: "light", strings: {} },
      flash: {},
      locale: "en",
      version: "0.0.0-test",
      scope: {},
      contract,
      navigation: { tree: [], activeKey: "", footer: [] },
      ...extra,
    },
    url: "/test",
  };
}

// ── Test suite ────────────────────────────────────────────────────────────────

describe("ContractPage integration", () => {
  afterEach(() => {
    cleanup();
  });

  // Register all defaults (shells, layouts, blocks, fields, icons, cells) once
  beforeAll(async () => {
    const { registerDefaults } = await import("@/app/register-defaults");
    registerDefaults();
  });

  // --------------------------------------------------------------------------
  // 1. Dashboard layout with metric cards and dense table
  // --------------------------------------------------------------------------

  it("renders a dashboard contract with metric cards and dense table", async () => {
    const { ContractPage } = await import("@/app/ContractPage");
    const { I18nProvider } = await import("@/i18n/I18nProvider");

    const contract = {
      version: "1" as const,
      shell: "product",
      page: {
        key: "dashboard",
        title: "Dashboard",
        breadcrumbs: [{ label: "Home", href: "/" }],
      },
      layout: {
        template: "dashboard",
        regions: {
          metrics: [
            {
              type: "metric_card",
              key: "users",
              data: { label: "Users", value: "500", icon: "users" },
            },
            {
              type: "metric_card",
              key: "revenue",
              data: { label: "Revenue", value: "$10K", icon: "chart" },
            },
          ],
          content: [
            {
              type: "dense_table",
              key: "recent",
              title: "Recent",
              data: {
                columns: [
                  { key: "name", label: "Name" },
                  { key: "status", label: "Status" },
                ],
                rows: [{ id: 1, name: "Item A", status: "Active" }],
                pagination: { page: 1, perPage: 10, total: 1, lastPage: 1 },
                sort: { column: null, direction: null },
                filters: { available: [], applied: {} },
              },
            },
          ],
        },
      },
    };

    mockUsePage.mockReturnValue(makePageProps(contract));

    render(
      <I18nProvider>
        <ContractPage contract={contract} />
      </I18nProvider>,
    );

    // Metric cards rendered their labels and values
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("$10K")).toBeInTheDocument();

    // Dense table rendered column headers
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();

    // Dense table rendered row data
    expect(screen.getByText("Item A")).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // 2. Stack layout with empty state (ImmersiveShell)
  // --------------------------------------------------------------------------

  it("renders a stack layout with empty state block in immersive shell", async () => {
    const { ContractPage } = await import("@/app/ContractPage");
    const { I18nProvider } = await import("@/i18n/I18nProvider");

    const contract = {
      version: "1" as const,
      shell: "immersive",
      page: { key: "empty", title: "Empty Page", breadcrumbs: [] },
      layout: {
        template: "stack",
        regions: {
          content: [
            {
              type: "empty_state",
              key: "no-data",
              data: { description: "Nothing here yet", icon: "inbox" },
            },
          ],
        },
      },
    };

    mockUsePage.mockReturnValue(makePageProps(contract));

    render(
      <I18nProvider>
        <ContractPage contract={contract} />
      </I18nProvider>,
    );

    // ImmersiveShell renders page title in the top bar
    expect(screen.getByText("Empty Page")).toBeInTheDocument();

    // Empty state renders its description
    expect(screen.getByText("Nothing here yet")).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // 3. Sidebar layout with link list + detail panel
  // --------------------------------------------------------------------------

  it("renders a sidebar layout with link list and detail panel", async () => {
    const { ContractPage } = await import("@/app/ContractPage");
    const { I18nProvider } = await import("@/i18n/I18nProvider");

    const contract = {
      version: "1" as const,
      shell: "product",
      page: { key: "detail", title: "Detail View", breadcrumbs: [] },
      layout: {
        template: "sidebar",
        regions: {
          main: [
            {
              type: "link_list",
              key: "links",
              data: {
                items: [
                  {
                    label: "Settings",
                    href: "/settings",
                    description: "Configure your account",
                  },
                ],
              },
            },
          ],
          aside: [
            {
              type: "detail_panel",
              key: "info",
              data: {
                sections: [
                  {
                    id: "meta",
                    title: "Metadata",
                    fields: [{ key: "version", label: "Version", value: "1.0.0" }],
                  },
                ],
              },
            },
          ],
        },
      },
    };

    mockUsePage.mockReturnValue(makePageProps(contract));

    render(
      <I18nProvider>
        <ContractPage contract={contract} />
      </I18nProvider>,
    );

    // Link list renders the link label and description
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Configure your account")).toBeInTheDocument();

    // Detail panel renders section title and field value
    expect(screen.getByText("Metadata")).toBeInTheDocument();
    expect(screen.getByText("1.0.0")).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // 4. Unknown block type — graceful fallback
  // --------------------------------------------------------------------------

  it("falls back gracefully for unknown block type", async () => {
    const { ContractPage } = await import("@/app/ContractPage");
    const { I18nProvider } = await import("@/i18n/I18nProvider");

    const contract = {
      version: "1" as const,
      shell: "immersive",
      page: { key: "unknown", title: "Unknown Blocks", breadcrumbs: [] },
      layout: {
        template: "stack",
        regions: {
          content: [{ type: "nonexistent_block", key: "mystery", data: {} }],
        },
      },
    };

    mockUsePage.mockReturnValue(makePageProps(contract));

    // Should not crash — renders diagnostic placeholder
    render(
      <I18nProvider>
        <ContractPage contract={contract} />
      </I18nProvider>,
    );

    expect(screen.getByText(/nonexistent_block/)).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // 5. Unknown shell — falls back to the immersive shell
  // --------------------------------------------------------------------------
  // ContractPage resolves `resolveShell(shell) ?? resolveShell("immersive")`
  // (ContractPage.tsx:31-33), so an unregistered shell key falls back to the
  // built-in immersive shell — NOT a "product" shell (none is registered;
  // registerDefaults only ships "basic" + "immersive").

  it("falls back to the immersive shell for unknown shell type", async () => {
    const { ContractPage } = await import("@/app/ContractPage");
    const { I18nProvider } = await import("@/i18n/I18nProvider");

    const contract = {
      version: "1" as const,
      shell: "custom_shell_xyz",
      page: { key: "fallback", title: "Fallback Shell Page", breadcrumbs: [] },
      layout: {
        template: "stack",
        regions: {
          content: [
            {
              type: "empty_state",
              key: "placeholder",
              data: { description: "Content inside fallback shell" },
            },
          ],
        },
      },
    };

    mockUsePage.mockReturnValue(makePageProps(contract));

    // ContractPage falls back to the immersive shell when an unknown shell is requested
    render(
      <I18nProvider>
        <ContractPage contract={contract} />
      </I18nProvider>,
    );

    // The immersive shell renders a slim top bar with a Close button — a marker
    // unique to ImmersiveShell (BasicShell renders sidebar/nav + Sign out).
    // Asserting it proves WHICH shell handled the fallback, not just that
    // *some* shell rendered the content.
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    // The content should still render via the fallback shell.
    expect(screen.getByText("Content inside fallback shell")).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // 5b. Auth shell — chromeless centered card for guest entry points (E1.2)
  // --------------------------------------------------------------------------

  it("renders the built-in auth shell as a chromeless centered card", async () => {
    const { ContractPage } = await import("@/app/ContractPage");
    const { I18nProvider } = await import("@/i18n/I18nProvider");

    const contract = {
      version: "1" as const,
      shell: "auth",
      page: { key: "login", title: "Sign in", subtitle: "Welcome back", breadcrumbs: [] },
      layout: {
        template: "stack",
        regions: {
          content: [{ type: "empty_state", key: "slot", data: { description: "login form here" } }],
        },
      },
    };

    // Guest page: no authenticated user.
    mockUsePage.mockReturnValue(makePageProps(contract, { auth: null }));

    render(
      <I18nProvider>
        <ContractPage contract={contract} />
      </I18nProvider>,
    );

    // Title + subtitle from the contract render inside the card.
    expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    // The content region renders inside the shell.
    expect(screen.getByText("login form here")).toBeInTheDocument();
    // It resolved to AuthShell, not the immersive fallback: no Close button.
    expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
  });

  it("validates and renders the standalone login.json golden contract", async () => {
    const { ContractPage } = await import("@/app/ContractPage");
    const { I18nProvider } = await import("@/i18n/I18nProvider");

    const contract = loginGolden.props.contract as unknown as PageContract;

    // The captured wire from libs/middag-php-demo-standalone validates cleanly
    // against the current PageContract schema (null = no validation errors).
    expect(validatePageContract(contract)).toBeNull();

    mockUsePage.mockReturnValue(
      makePageProps(contract, {
        auth: loginGolden.props.auth,
        csrf_token: loginGolden.props.csrf_token,
      }),
    );

    render(
      <I18nProvider>
        <ContractPage contract={contract} />
      </I18nProvider>,
    );

    // The auth shell renders the page title, and the lazy form_panel renders the
    // email/password field labels inside the card.
    expect(await screen.findByRole("heading", { name: "Sign in" })).toBeInTheDocument();
    expect(await screen.findByText("Email")).toBeInTheDocument();
    expect(await screen.findByText("Password")).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // 6. Unknown layout — falls back to stack
  // --------------------------------------------------------------------------

  it("falls back to stack layout for unknown layout template", async () => {
    const { ContractPage } = await import("@/app/ContractPage");
    const { I18nProvider } = await import("@/i18n/I18nProvider");

    const contract = {
      version: "1" as const,
      shell: "immersive",
      page: { key: "custom-layout", title: "Custom Layout", breadcrumbs: [] },
      layout: {
        template: "nonexistent_layout",
        regions: {
          content: [
            {
              type: "empty_state",
              key: "fallback-content",
              data: { description: "Rendered via stack fallback" },
            },
          ],
        },
      },
    };

    mockUsePage.mockReturnValue(makePageProps(contract));

    render(
      <I18nProvider>
        <ContractPage contract={contract} />
      </I18nProvider>,
    );

    // Content renders via stack fallback layout
    expect(screen.getByText("Rendered via stack fallback")).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // 7. Invalid contract — renders validation errors
  // --------------------------------------------------------------------------

  it("renders validation errors for invalid contract", async () => {
    const { ContractPage } = await import("@/app/ContractPage");
    const { I18nProvider } = await import("@/i18n/I18nProvider");

    // Missing required fields: version, page.key, page.title, layout
    const invalidContract = {
      shell: "product",
      page: { title: "Broken" },
    } as never;

    mockUsePage.mockReturnValue(makePageProps(invalidContract));

    render(
      <I18nProvider>
        <ContractPage contract={invalidContract} />
      </I18nProvider>,
    );

    // Should show the translated, accessible validation diagnostic (E5.1).
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Invalid page contract.");
  });

  // --------------------------------------------------------------------------
  // 8. Multiple blocks in same region stack correctly
  // --------------------------------------------------------------------------

  it("renders multiple blocks stacked in the same region", async () => {
    const { ContractPage } = await import("@/app/ContractPage");
    const { I18nProvider } = await import("@/i18n/I18nProvider");

    const contract = {
      version: "1" as const,
      shell: "immersive",
      page: { key: "multi", title: "Multi Block", breadcrumbs: [] },
      layout: {
        template: "stack",
        regions: {
          content: [
            {
              type: "empty_state",
              key: "first",
              data: { description: "First block content" },
            },
            {
              type: "empty_state",
              key: "second",
              data: { description: "Second block content" },
            },
            {
              type: "link_list",
              key: "links",
              data: {
                items: [{ label: "Third block link", href: "/third" }],
              },
            },
          ],
        },
      },
    };

    mockUsePage.mockReturnValue(makePageProps(contract));

    render(
      <I18nProvider>
        <ContractPage contract={contract} />
      </I18nProvider>,
    );

    expect(screen.getByText("First block content")).toBeInTheDocument();
    expect(screen.getByText("Second block content")).toBeInTheDocument();
    expect(screen.getByText("Third block link")).toBeInTheDocument();
  });

  // --------------------------------------------------------------------------
  // 9. Dashboard layout with metrics + content + aside regions
  // --------------------------------------------------------------------------

  it("renders dashboard layout with all three regions populated", async () => {
    const { ContractPage } = await import("@/app/ContractPage");
    const { I18nProvider } = await import("@/i18n/I18nProvider");

    const contract = {
      version: "1" as const,
      shell: "product",
      page: { key: "full-dashboard", title: "Full Dashboard", breadcrumbs: [] },
      layout: {
        template: "dashboard",
        regions: {
          metrics: [
            {
              type: "metric_card",
              key: "m1",
              data: { label: "Active Users", value: 1284 },
            },
          ],
          content: [
            {
              type: "link_list",
              key: "main-links",
              data: {
                items: [
                  { label: "Dashboard Main Content", href: "/main", description: "Primary area" },
                ],
              },
            },
          ],
          aside: [
            {
              type: "detail_panel",
              key: "side-info",
              data: {
                sections: [
                  {
                    id: "aside-section",
                    title: "Aside Panel",
                    fields: [{ key: "env", label: "Environment", value: "Production" }],
                  },
                ],
              },
            },
          ],
        },
      },
    };

    mockUsePage.mockReturnValue(makePageProps(contract));

    render(
      <I18nProvider>
        <ContractPage contract={contract} />
      </I18nProvider>,
    );

    // Metrics region
    expect(screen.getByText("Active Users")).toBeInTheDocument();

    // Content region
    expect(screen.getByText("Dashboard Main Content")).toBeInTheDocument();

    // Aside region
    expect(screen.getByText("Aside Panel")).toBeInTheDocument();
    expect(screen.getByText("Production")).toBeInTheDocument();
  });
});

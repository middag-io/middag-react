/**
 * Layout render smoke tests — each layout renders without crashing.
 *
 * Provides minimal LayoutProps (layout descriptor + renderBlock mock).
 * Does NOT test full block rendering — just that the layout mounts.
 */

import type { ReactElement } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { LayoutProps } from "@/app/registries";
import type { BlockDescriptor, LayoutDescriptor } from "@/contracts/page-contract";
import { I18nProvider } from "@/i18n/I18nProvider";

// Mock Inertia at top level — WizardLayout uses usePage for step indicator
vi.mock("@inertiajs/react", () => ({
  usePage: () => ({
    props: {
      contract: {
        page: { key: "test", title: "Test", breadcrumbs: [] },
      },
    },
    url: "/",
  }),
  router: { on: () => () => {} },
}));

// renderBlock mock with key prop to suppress React key warnings
function mockRenderBlock(block: BlockDescriptor): ReactElement {
  return (
    <div key={block.key} data-testid={`block-${block.key}`}>
      {block.type}
    </div>
  );
}

function renderLayout(Layout: (props: LayoutProps) => ReactElement, layout: LayoutDescriptor) {
  return render(
    <I18nProvider>
      <Layout layout={layout} renderBlock={mockRenderBlock} />
    </I18nProvider>,
  );
}

describe("layout render smoke tests", () => {
  afterEach(() => {
    cleanup();
  });
  it("StackLayout renders content blocks", async () => {
    const { StackLayout } = await import("@/base/layout/StackLayout");
    renderLayout(StackLayout, {
      template: "stack",
      regions: {
        content: [
          { type: "metric_card", key: "kpi1", data: {} },
          { type: "dense_table", key: "table1", data: {} },
        ],
      },
    });

    expect(screen.getByTestId("block-kpi1")).toBeDefined();
    expect(screen.getByTestId("block-table1")).toBeDefined();
  });

  it("StackLayout renders with empty regions", async () => {
    const { StackLayout } = await import("@/base/layout/StackLayout");
    const { container } = renderLayout(StackLayout, {
      template: "stack",
      regions: { content: [] },
    });
    expect(container.firstChild).toBeDefined();
  });

  it("StackLayout applies px-6 to blocks by default", async () => {
    const { StackLayout } = await import("@/base/layout/StackLayout");
    renderLayout(StackLayout, {
      template: "stack",
      regions: {
        content: [{ type: "metric_card", key: "padded", data: {} }],
      },
    });

    const block = screen.getByTestId("block-padded");
    // Block is wrapped in a div with px-6
    expect(block.parentElement?.className).toContain("px-6");
  });

  it("StackLayout skips padding for fullBleed blocks", async () => {
    const { StackLayout } = await import("@/base/layout/StackLayout");
    renderLayout(StackLayout, {
      template: "stack",
      regions: {
        content: [
          {
            type: "dense_table",
            key: "fullbleed",
            data: {},
            meta: { fullBleed: true },
          },
        ],
      },
    });

    const block = screen.getByTestId("block-fullbleed");
    // Block wrapper should NOT have px-6
    expect(block.parentElement?.className).not.toContain("px-6");
  });

  it("SidebarLayout renders main and aside regions", async () => {
    const { SidebarLayout } = await import("@/base/layout/SidebarLayout");
    renderLayout(SidebarLayout, {
      template: "sidebar",
      regions: {
        main: [{ type: "card_grid", key: "main1", data: {} }],
        aside: [{ type: "detail_panel", key: "aside1", data: {} }],
      },
    });

    expect(screen.getByTestId("block-main1")).toBeDefined();
    expect(screen.getByTestId("block-aside1")).toBeDefined();
  });

  it("SidebarLayout renders header when present", async () => {
    const { SidebarLayout } = await import("@/base/layout/SidebarLayout");
    renderLayout(SidebarLayout, {
      template: "sidebar",
      regions: {
        header: [{ type: "status_strip", key: "h1", data: {} }],
        main: [{ type: "dense_table", key: "m1", data: {} }],
        aside: [{ type: "detail_panel", key: "a1", data: {} }],
      },
    });

    expect(screen.getByTestId("block-h1")).toBeDefined();
    expect(screen.getByTestId("block-m1")).toBeDefined();
    expect(screen.getByTestId("block-a1")).toBeDefined();
  });

  it("SidebarLayout aside has border styling", async () => {
    const { SidebarLayout } = await import("@/base/layout/SidebarLayout");
    renderLayout(SidebarLayout, {
      template: "sidebar",
      regions: {
        main: [{ type: "card_grid", key: "m1", data: {} }],
        aside: [{ type: "detail_panel", key: "a1", data: {} }],
      },
    });

    const aside = document.querySelector("aside");
    expect(aside).not.toBeNull();
    expect(aside!.className).toContain("border-l");
  });

  it("DashboardLayout renders metrics and content", async () => {
    const { DashboardLayout } = await import("@/base/layout/DashboardLayout");
    renderLayout(DashboardLayout, {
      template: "dashboard",
      regions: {
        metrics: [
          { type: "metric_card", key: "m1", data: {} },
          { type: "metric_card", key: "m2", data: {} },
        ],
        content: [{ type: "dense_table", key: "c1", data: {} }],
      },
    });

    expect(screen.getByTestId("block-m1")).toBeDefined();
    expect(screen.getByTestId("block-m2")).toBeDefined();
    expect(screen.getByTestId("block-c1")).toBeDefined();
  });

  it("WizardLayout renders step content", async () => {
    const { WizardLayout } = await import("@/base/layout/WizardLayout");
    renderLayout(WizardLayout, {
      template: "wizard",
      regions: {
        header: [],
        content: [{ type: "form_panel", key: "step1", data: {} }],
      },
    });

    expect(screen.getByTestId("block-step1")).toBeDefined();
  });
});

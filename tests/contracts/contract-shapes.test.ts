/**
 * Contract shape tests — validates TypeScript interfaces at runtime.
 *
 * These tests create objects that satisfy each contract interface and
 * pass them through the Zod schema or structural checks. If a field
 * is renamed or removed from the interface, the test fails at compile
 * time (TypeScript) or runtime (missing required field).
 *
 * Purpose: detect breaking changes in contracts consumed by Moodle/WP hosts.
 */

import { describe, expect, it } from "vitest";

import type {
  ActionGridBlockData,
  ActivityTimelineBlockData,
  CardGridBlockData,
  DenseTableBlockData,
  DetailPanelBlockData,
  EmptyStateBlockData,
  FormPanelBlockData,
  LinkListBlockData,
  MarkdownPanelBlockData,
  MetricCardBlockData,
  StatusStripBlockData,
  TabsBlockData,
} from "@/contracts/block-data";
import type { NavigationNode, NavigationTreePayload } from "@/contracts/navigation";
import type {
  Breadcrumb,
  ContractPageProps,
  LayoutDescriptor,
  PageAction,
  PageContract,
  PageMeta,
} from "@/contracts/page-contract";
import { validatePageContract } from "@/contracts/page-contract-schema";
import type {
  SharedProps,
  SharedPropsAuth,
  SharedPropsFlash,
  SharedPropsTheme,
} from "@/contracts/shared-props";

// ── PageContract with all optional fields ──────────────────────────────

const FULL_PAGE_META: PageMeta = {
  key: "test-page",
  title: "Test Page",
  subtitle: "A subtitle",
  breadcrumbs: [
    { label: "Home", href: "/" },
    { label: "Test", href: "/test" },
    { label: "Current" },
  ] satisfies Breadcrumb[],
  actions: [
    {
      id: "create",
      label: "Create",
      intent: "primary",
      target: { kind: "link", href: "/create" },
      icon: "plus",
    },
  ] satisfies PageAction[],
};

const FULL_CONTRACT: PageContract = {
  version: "1",
  shell: "product",
  page: FULL_PAGE_META,
  layout: {
    template: "dashboard",
    regions: {
      metrics: [
        {
          type: "metric_card",
          key: "kpi1",
          data: { label: "Users", value: "100" },
        },
      ],
      content: [{ type: "dense_table", key: "table1", data: { columns: [], rows: [] } }],
    },
    meta: { customKey: true },
  },
  resources: {
    preferences: { theme: "light", locale: "en" },
    capabilities: { "local/middag:view": true },
    featureFlags: { beta: true },
  },
  entities: { user: "/users/{id}" },
};

describe("PageContract shape", () => {
  it("validates a full contract with all optional fields", () => {
    const errors = validatePageContract(FULL_CONTRACT);
    expect(errors).toBeNull();
  });

  it("validates contract with immersive shell", () => {
    const contract: PageContract = {
      ...FULL_CONTRACT,
      shell: "immersive",
    };
    expect(validatePageContract(contract)).toBeNull();
  });

  it("validates contract with admin shell", () => {
    const contract: PageContract = {
      ...FULL_CONTRACT,
      shell: "admin",
    };
    expect(validatePageContract(contract)).toBeNull();
  });

  it("validates contract with custom shell (extensible)", () => {
    const contract: PageContract = {
      ...FULL_CONTRACT,
      shell: "my-custom-shell",
    };
    expect(validatePageContract(contract)).toBeNull();
  });

  it("all layout templates pass validation", () => {
    const templates = ["stack", "split", "dashboard", "master-detail", "wizard", "canvas"];
    for (const template of templates) {
      const contract: PageContract = {
        ...FULL_CONTRACT,
        layout: {
          template: template as LayoutDescriptor["template"],
          regions: { content: [] },
        },
      };
      expect(validatePageContract(contract)).toBeNull();
    }
  });
});

// ── ContractPageProps ──────────────────────────────────────────────────

describe("ContractPageProps shape", () => {
  it("satisfies the interface with all optional props", () => {
    const props: ContractPageProps = {
      contract: FULL_CONTRACT,
      overlay: true,
    };
    expect(props.contract.version).toBe("1");
    expect(props.overlay).toBe(true);
  });
});

// ── SharedProps ────────────────────────────────────────────────────────

describe("SharedProps shape", () => {
  it("satisfies the full interface", () => {
    const auth: SharedPropsAuth = {
      id: 1,
      name: "Admin",
      email: "admin@example.com",
      avatarUrl: "https://example.com/avatar.jpg",
      capabilities: ["local/middag:manage", "local/middag:view"],
    };
    const theme: SharedPropsTheme = {
      strings: { "middag.ui.confirm": "Confirm" },
      appearance: "dark",
      brandColor: "#3b82f6",
    };
    const flash: SharedPropsFlash = {
      success: "Saved",
      error: "Failed",
      info: "Note",
      warning: "Careful",
    };
    const shared: SharedProps = {
      navigation: {
        activeKey: "dashboard",
        tree: [{ key: "dashboard", label: "Dashboard", href: "/" }],
        footer: [],
      },
      auth,
      theme,
      flash,
      locale: "pt-BR",
      version: "0.12.0",
      scope: { organization: { id: 1, name: "Acme" } },
    };

    expect(shared.auth?.id).toBe(1);
    expect(shared.auth?.capabilities).toHaveLength(2);
    expect(shared.theme.appearance).toBe("dark");
    expect(shared.flash?.success).toBe("Saved");
    expect(shared.locale).toBe("pt-BR");
  });
});

// ── NavigationTreePayload ────────────────────────────────────────────

describe("NavigationTreePayload shape", () => {
  it("satisfies the tree payload interface", () => {
    const node: NavigationNode = {
      key: "dashboard",
      label: "Dashboard",
      href: "/",
      icon: "home",
      children: [],
    };
    const treePayload: NavigationTreePayload = {
      activeKey: "dashboard",
      tree: [node],
      footer: [],
    };
    expect(treePayload.tree).toHaveLength(1);
    expect(treePayload.tree[0].key).toBe("dashboard");
  });
});

// ── Block data shapes ─────────────────────────────────────────────────

describe("block data shapes", () => {
  it("DenseTableBlockData", () => {
    const data: DenseTableBlockData = {
      columns: [{ key: "name", label: "Name", sortable: true }],
      rows: [{ id: 1, name: "Test" }],
      pagination: { page: 1, perPage: 10, total: 1, lastPage: 1 },
      sort: { column: "name", direction: "asc" },
      filters: { available: [], applied: {} },
    };
    expect(data.columns).toHaveLength(1);
    expect(data.pagination.total).toBe(1);
  });

  it("MetricCardBlockData", () => {
    const data: MetricCardBlockData = {
      label: "Users",
      value: "1,284",
      delta: "+12%",
      deltaDirection: "positive",
    };
    expect(data.label).toBe("Users");
  });

  it("EmptyStateBlockData", () => {
    const data: EmptyStateBlockData = {
      variant: "first-use",
      description: "Create your first item",
    };
    expect(data.variant).toBe("first-use");
  });

  it("FormPanelBlockData", () => {
    const data: FormPanelBlockData = {
      action: "/api/settings",
      method: "put",
      schema: [
        {
          kind: "field",
          key: "name",
          component: "text",
          props: { label: "Name", required: true },
        },
      ],
      values: { name: "Test" },
      errors: {},
      meta: { submitLabel: "Save" },
    };
    expect(data.schema).toHaveLength(1);
  });

  it("DetailPanelBlockData", () => {
    const data: DetailPanelBlockData = {
      sections: [
        {
          id: "overview",
          title: "Overview",
          fields: [{ key: "status", label: "Status", value: "Active" }],
        },
      ],
    };
    expect(data.sections).toHaveLength(1);
  });

  it("ActivityTimelineBlockData", () => {
    const data: ActivityTimelineBlockData = {
      groups: [
        {
          label: "Today",
          entries: [
            {
              id: "1",
              actor: "Admin",
              action: "created",
              icon: "add",
              color: "success",
              timestamp: 1735689600,
            },
          ],
        },
      ],
    };
    expect(data.groups).toHaveLength(1);
    expect(data.groups[0].entries).toHaveLength(1);
  });

  it("StatusStripBlockData", () => {
    const data: StatusStripBlockData = {
      items: [
        {
          key: "uptime",
          label: "Uptime",
          value: "99.9%",
          appearance: "success",
        },
      ],
    };
    expect(data.items).toHaveLength(1);
  });

  it("CardGridBlockData", () => {
    const data: CardGridBlockData = {
      columns: [{ key: "name", label: "Name" }],
      rows: [{ id: 1, name: "Card" }],
    };
    expect(data.rows).toHaveLength(1);
  });

  it("ActionGridBlockData", () => {
    const data: ActionGridBlockData = {
      items: [
        {
          id: "1",
          label: "Action",
          title: "Action",
          description: "Do something",
          icon: "play",
          target: { kind: "link", href: "/action" },
          intent: "primary",
        },
      ],
    };
    expect(data.items).toHaveLength(1);
  });

  it("LinkListBlockData", () => {
    const data: LinkListBlockData = {
      items: [{ label: "Link", href: "/page" }],
    };
    expect(data.items).toHaveLength(1);
  });

  it("MarkdownPanelBlockData", () => {
    const data: MarkdownPanelBlockData = {
      content: "# Hello",
    };
    expect(data.content).toBe("# Hello");
  });

  it("TabsBlockData", () => {
    const data: TabsBlockData = {
      defaultTab: "general",
      tabs: [{ id: "general", label: "General", blocks: [] }],
    };
    expect(data.tabs).toHaveLength(1);
  });

  // NOTE: Pro block shapes (FlowEditor, FormBuilder, ConditionTree,
  // SentenceBuilder, Kanban, Chart, Gradebook) are NOT part of the Community
  // contract surface (Option A — they live in @middag-io/react-pro/generated).
  // Their shape tests belong in the react-pro suite, not here; importing them
  // from @/contracts/block-data was silent drift (the types do not exist in
  // Community and tests were not type-checked).
  //
  // The same applies to the page-chrome Pro types — PollingMeta, HelpData,
  // InspectorData and PageFilterTab — plus PageMeta.icon and PageResources.locale.
  // These moved to @middag-io/react-pro (PageMetaExtensions / PageResourcesExtensions /
  // Pro ContractPageProps). A Community shape test must not depend on react-pro, so
  // those fixtures and assertions were removed rather than re-pointed at the Pro tier.
});

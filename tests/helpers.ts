/**
 * Mock data factories for block render tests.
 *
 * Each factory returns the minimal valid BlockProps<TData> for its block type.
 * Use spread to override individual fields in specific tests.
 */

import type { BlockDescriptor } from "@/contracts/page-contract";

/** Build a BlockDescriptor with defaults. */
export function block<T>(
  type: string,
  key: string,
  data: T,
  overrides?: Partial<BlockDescriptor<T>>,
): BlockDescriptor<T> {
  return { type, key, data, ...overrides };
}

// ── MetricCard ──────────────────────────────────────────────────────────

export function metricCardData() {
  return {
    label: "Total Users",
    value: "1,284" as string | number,
    delta: "+12%",
    deltaDirection: "positive" as const,
    icon: "users",
  };
}

// ── LinkList ────────────────────────────────────────────────────────────

export function linkListData() {
  return {
    items: [
      { label: "Documentation", href: "/docs", icon: "file-text", description: "View the docs" },
      { label: "API Reference", href: "/api", description: "REST API guide" },
      { label: "External Link", href: "https://example.com", external: true },
    ],
  };
}

// ── StatusStrip ─────────────────────────────────────────────────────────

export function statusStripData() {
  return {
    score: 85,
    tone: "success" as const,
    items: [
      { key: "uptime", label: "Uptime", value: "99.9%", appearance: "success" as const },
      { key: "errors", label: "Errors", value: "3", appearance: "warning" as const },
    ],
  };
}

// ── EmptyState ──────────────────────────────────────────────────────────

export function emptyStateData() {
  return {
    variant: "first-use" as const,
    icon: "inbox",
    description: "No items found",
  };
}

// ── MarkdownPanel ───────────────────────────────────────────────────────

export function markdownPanelData() {
  return {
    content: "# Hello\n\nThis is **markdown** content.",
  };
}

// ── DetailPanel ─────────────────────────────────────────────────────────

export function detailPanelData() {
  return {
    sections: [
      {
        id: "overview",
        title: "Overview",
        fields: [
          { key: "name", label: "Name", value: "Test Item" },
          { key: "status", label: "Status", value: "Active", kind: "status" as const },
          { key: "created", label: "Created", value: "2024-01-15" },
        ],
      },
    ],
  };
}

// ── ActionGrid ──────────────────────────────────────────────────────────

export function actionGridData() {
  return {
    items: [
      {
        id: "sync",
        label: "Sync Data",
        title: "Sync Data",
        description: "Synchronize all records",
        icon: "refresh",
        href: "/api/sync",
        method: "post" as const,
      },
      {
        id: "export",
        label: "Export CSV",
        title: "Export CSV",
        description: "Download as CSV",
        icon: "download",
        href: "/api/export",
      },
    ],
  };
}

// ── ActivityTimeline ────────────────────────────────────────────────────

export function activityTimelineData() {
  return {
    groups: [
      {
        label: "Today",
        entries: [
          {
            id: "1",
            actor: "Alice",
            action: "created",
            target: "Document A",
            timestamp: 1705312200,
            icon: "add",
            color: "success" as const,
          },
          {
            id: "2",
            actor: "Bob",
            action: "updated",
            target: "Document B",
            timestamp: 1705306800,
            icon: "edit",
            color: "info" as const,
          },
        ],
      },
    ],
  };
}

// ── CardGrid ────────────────────────────────────────────────────────────

export function cardGridData() {
  return {
    columns: [
      { key: "name", label: "Name" },
      { key: "status", label: "Status", kind: "status" as const },
    ],
    rows: [
      { id: 1, name: "Item One", status: "Active", icon: "plug", href: "/items/1" },
      { id: 2, name: "Item Two", status: "Inactive", icon: "plug", href: "/items/2" },
    ],
  };
}

// ── DenseTable ──────────────────────────────────────────────────────────

export function denseTableData() {
  return {
    columns: [
      { key: "name", label: "Name", sortable: true },
      { key: "email", label: "Email" },
      { key: "status", label: "Status", variant: "status" as const },
    ],
    rows: [
      {
        id: 1,
        name: "Alice",
        email: "alice@example.com",
        status: { label: "Active", appearance: "success" },
      },
      {
        id: 2,
        name: "Bob",
        email: "bob@example.com",
        status: { label: "Pending", appearance: "warning" },
      },
    ],
    pagination: { page: 1, perPage: 10, total: 2, lastPage: 1 },
    sort: { column: "name" as string | null, direction: "asc" as "asc" | "desc" | null },
    filters: { available: [], applied: {} },
  };
}

// ── Tabs ────────────────────────────────────────────────────────────────

export function tabsData() {
  return {
    defaultTab: "general",
    tabs: [
      {
        id: "general",
        label: "General",
        blocks: [
          {
            type: "empty_state",
            key: "tab_empty",
            data: { description: "General content" },
          } as BlockDescriptor,
        ],
      },
      {
        id: "advanced",
        label: "Advanced",
        blocks: [] as BlockDescriptor[],
      },
    ],
  };
}

// ── FormPanel ───────────────────────────────────────────────────────────

export function formPanelData() {
  return {
    action: "/api/settings",
    method: "put" as const,
    schema: [
      {
        kind: "field" as const,
        key: "site_name",
        component: "text",
        props: { label: "Site Name", placeholder: "My Site", required: true },
      },
      {
        kind: "field" as const,
        key: "enable_feature",
        component: "switch",
        props: { label: "Enable Feature" },
      },
    ],
    values: { site_name: "Test Site", enable_feature: true },
    errors: {},
    meta: { submitLabel: "Save" },
  };
}

// ── ChartPanel ──────────────────────────────────────────────────────────

export function chartPanelData() {
  return {
    chartType: "bar" as const,
    categoryKey: "month",
    series: [{ key: "value", label: "Revenue", color: "oklch(0.6 0.2 260)" }],
    data: [
      { month: "Jan", value: 100 },
      { month: "Feb", value: 200 },
    ],
  };
}

// ── KanbanBoard ─────────────────────────────────────────────────────────

export function kanbanBoardData() {
  return {
    columns: [
      { id: "todo", title: "To Do", cards: [{ id: "1", title: "Task One" }] },
      { id: "doing", title: "In Progress", cards: [{ id: "2", title: "Task Two" }] },
      { id: "done", title: "Done", cards: [] },
    ],
  };
}

// ── FlowEditor ──────────────────────────────────────────────────────────

export function flowEditorData() {
  return {
    nodes: [
      { id: "1", type: "trigger", label: "Start", position: { x: 0, y: 0 } },
      { id: "2", type: "action", label: "Process", position: { x: 200, y: 0 } },
    ],
    edges: [{ id: "e1-2", source: "1", target: "2" }],
  };
}

// ── FormBuilder ─────────────────────────────────────────────────────────

export function formBuilderData() {
  return {
    fields: [
      { id: "f1", type: "text" as const, label: "Full Name", required: true },
      { id: "f2", type: "email" as const, label: "Email", required: true },
    ],
    availableTypes: [
      { type: "text", label: "Text", icon: "Aa" },
      { type: "email", label: "Email", icon: "@" },
      { type: "select", label: "Select", icon: "\u25BE" },
      { type: "checkbox", label: "Checkbox", icon: "\u2611" },
      { type: "textarea", label: "Textarea", icon: "\u2261" },
    ],
  };
}

// ── ConditionTree ───────────────────────────────────────────────────────

export function conditionTreeData() {
  return {
    root: {
      id: "g1",
      logic: "and" as const,
      rules: [
        { id: "r1", field: "status", operator: "equals", value: "active" },
        { id: "r2", field: "age", operator: "greater_than", value: "18" },
      ],
      groups: [],
    },
    availableFields: [
      { key: "status", label: "Status", type: "text" },
      { key: "age", label: "Age", type: "number" },
    ],
    availableOperators: [
      { key: "equals", label: "Equals" },
      { key: "not_equals", label: "Not equals" },
      { key: "greater_than", label: "Greater than" },
      { key: "less_than", label: "Less than" },
    ],
  };
}

// ── SentenceBuilder ─────────────────────────────────────────────────────

export function sentenceBuilderData() {
  return {
    revision: "rev-1",
    groups: [
      {
        id: "sg1",
        connector: "and" as const,
        rules: [
          { id: "sr1", field: "country", operator: "is", value: "Brazil" },
          { id: "sr2", field: "plan", operator: "is", value: "Pro" },
        ],
      },
    ],
    availableFields: [
      { key: "country", label: "Country", operators: ["is", "is_not"] },
      { key: "plan", label: "Plan", operators: ["is", "is_not"] },
    ],
  };
}

// ── ReportComposer ──────────────────────────────────────────────────────

export function reportData() {
  return {
    widgets: [
      {
        id: "m1",
        type: "metric" as const,
        layout: { x: 0, y: 0, w: 3, h: 2 },
        metric: { value: 42 as string | number, label: "Active users" },
      },
      {
        id: "c1",
        type: "chart" as const,
        layout: { x: 3, y: 0, w: 6, h: 3 },
        title: "Revenue",
        chart: {
          chartType: "bar" as const,
          data: [{ month: "Jan", rev: 10 }],
          series: [{ key: "rev", label: "Revenue" }],
          categoryKey: "month",
        },
      },
    ],
    revision: "rev-1",
    columns: 12,
    saveEndpoint: "/report/save",
  };
}

// ── Scheduler ───────────────────────────────────────────────────────────

export function schedulerData() {
  return {
    events: [
      {
        id: "s1",
        title: "Aula A",
        start: "2026-06-01T09:00:00",
        end: "2026-06-01T10:30:00",
        resourceId: "room-a",
      },
      {
        id: "s2",
        title: "Aula B",
        start: "2026-06-01T09:30:00",
        end: "2026-06-01T11:00:00",
        resourceId: "room-b",
      },
      {
        id: "s3",
        title: "Prazo final",
        start: "2026-06-03",
        end: "2026-06-03",
        allDay: true,
      },
      {
        id: "s4",
        title: "Mentoria solo",
        start: "2026-06-02T14:00:00",
        end: "2026-06-02T15:00:00",
      },
    ],
    resources: [
      { id: "room-a", label: "Sala A", color: "#2563eb" },
      { id: "room-b", label: "Sala B" },
    ],
    revision: "rev-1",
    view: "week" as const,
    date: "2026-06-01",
    moveEndpoint: "/scheduler/move",
    createEndpoint: "/scheduler/create",
    deleteEndpoint: "/scheduler/delete",
  };
}

// ── Gradebook ───────────────────────────────────────────────────────────

export function gradebookData() {
  return {
    columns: [
      { id: "name", label: "Student", type: "readonly" as const, editable: false },
      { id: "q1", label: "Quiz 1", type: "number" as const, editable: true },
      { id: "note", label: "Note", type: "text" as const, editable: true },
    ],
    rows: [
      { id: "s1", label: "Ana" },
      { id: "s2", label: "Bruno" },
    ],
    cells: [
      { rowId: "s1", columnId: "name", value: "Ana" as string | number | null },
      { rowId: "s1", columnId: "q1", value: 9.5 as string | number | null },
      { rowId: "s2", columnId: "name", value: "Bruno" as string | number | null },
      { rowId: "s2", columnId: "q1", value: 7 as string | number | null },
    ],
    revision: "rev-1",
    aggregations: [{ columnId: "q1", value: 8.25 as string | number | null, label: "Average" }],
    saveEndpoint: "/grades/save",
  };
}

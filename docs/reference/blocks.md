# Block Catalog

Block types with descriptions and data shape examples. Blocks are the atomic rendering units inside a layout region.

## Data Display

### dense_table

Sortable, filterable data table with row actions.

```ts
{
  type: 'dense_table',
  key: 'users-table',
  data: {
    columns: [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email' },
      { key: 'role', label: 'Role', filterable: true },
    ],
    rows: [
      { id: '1', cells: { name: 'Alice', email: 'alice@example.com', role: 'Admin' } },
      { id: '2', cells: { name: 'Bob', email: 'bob@example.com', role: 'User' } },
    ],
    actions: [
      { id: 'edit', label: 'Edit', intent: 'secondary' },
      { id: 'delete', label: 'Delete', intent: 'danger' },
    ],
  },
}
```

### detail_panel

Key-value detail view organized in sections.

```ts
{
  type: 'detail_panel',
  key: 'user-detail',
  data: {
    sections: [
      {
        title: 'General',
        fields: [
          { key: 'name', label: 'Full Name', value: 'Alice Johnson' },
          { key: 'email', label: 'Email', value: 'alice@example.com' },
          { key: 'status', label: 'Status', value: 'Active', variant: 'success' },
        ],
      },
    ],
  },
}
```

### card_grid

Grid of cards with status indicators, actions, and metadata.

```ts
{
  type: 'card_grid',
  key: 'connectors-grid',
  data: {
    columns: 3,
    cards: [
      {
        id: 'sap',
        title: 'SAP SuccessFactors',
        description: 'HR data synchronization',
        status: { label: 'Connected', variant: 'success' },
        actions: [{ id: 'configure', label: 'Configure', intent: 'secondary' }],
      },
    ],
  },
}
```

### link_list

Simple list of labeled links with optional icons.

```ts
{
  type: 'link_list',
  key: 'quick-links',
  data: {
    items: [
      { label: 'Documentation', href: '/docs', icon: 'book-open' },
      { label: 'API Reference', href: '/api', icon: 'code' },
      { label: 'Support', href: '/support', icon: 'help-circle' },
    ],
  },
}
```

### status_strip

Horizontal strip of status or metric badges.

```ts
{
  type: 'status_strip',
  key: 'system-status',
  data: {
    items: [
      { label: 'API', value: 'Healthy', variant: 'success' },
      { label: 'Queue', value: '12 pending', variant: 'warning' },
      { label: 'Errors', value: '0', variant: 'neutral' },
    ],
  },
}
```

### activity_timeline

Chronological list of events with actor and timestamp.

```ts
{
  type: 'activity_timeline',
  key: 'recent-activity',
  data: {
    events: [
      {
        id: '1',
        actor: 'Alice',
        action: 'created connector',
        target: 'SAP SuccessFactors',
        timestamp: '2026-04-30T14:30:00Z',
      },
      {
        id: '2',
        actor: 'Bob',
        action: 'updated workflow',
        target: 'Onboarding',
        timestamp: '2026-04-30T13:15:00Z',
      },
    ],
  },
}
```

## Forms

### form_panel

Dynamic form with field groups, validation rules, and submit action.

```ts
{
  type: 'form_panel',
  key: 'settings-form',
  data: {
    action: '/api/settings',
    method: 'post',
    groups: [
      {
        title: 'General',
        fields: [
          { key: 'name', label: 'Name', type: 'text', required: true },
          { key: 'email', label: 'Email', type: 'email', required: true },
          { key: 'role', label: 'Role', type: 'select', options: [
            { value: 'admin', label: 'Admin' },
            { value: 'user', label: 'User' },
          ]},
        ],
      },
    ],
    submit: { label: 'Save', intent: 'primary' },
  },
}
```

See [Forms Guide](/guides/forms) for full schema documentation.

### form_builder

Drag-and-drop form field designer for custom forms.

```ts
{
  type: 'form_builder',
  key: 'custom-form-builder',
  data: {
    availableFields: [
      { type: 'text', label: 'Text Input' },
      { type: 'textarea', label: 'Text Area' },
      { type: 'select', label: 'Dropdown' },
      { type: 'checkbox', label: 'Checkbox' },
      { type: 'date', label: 'Date Picker' },
    ],
    fields: [
      { id: 'f1', type: 'text', label: 'Full Name', required: true },
      { id: 'f2', type: 'email', label: 'Email Address' },
    ],
  },
}
```

### sentence_builder

Natural language rule composer with slot-based segments.

```ts
{
  type: 'sentence_builder',
  key: 'segment-rule',
  data: {
    template: 'Include users where {field} {operator} {value}',
    slots: {
      field: { type: 'select', options: ['department', 'role', 'location'] },
      operator: { type: 'select', options: ['equals', 'contains', 'starts with'] },
      value: { type: 'text' },
    },
    rules: [
      { field: 'department', operator: 'equals', value: 'Engineering' },
    ],
  },
}
```

### condition_tree

Nested AND/OR condition tree editor for complex rules.

```ts
{
  type: 'condition_tree',
  key: 'access-conditions',
  data: {
    root: {
      operator: 'AND',
      children: [
        { field: 'role', comparator: 'equals', value: 'manager' },
        {
          operator: 'OR',
          children: [
            { field: 'department', comparator: 'equals', value: 'Sales' },
            { field: 'department', comparator: 'equals', value: 'Marketing' },
          ],
        },
      ],
    },
    availableFields: [
      { key: 'role', label: 'Role', type: 'select' },
      { key: 'department', label: 'Department', type: 'select' },
    ],
  },
}
```

## Content

### empty_state

Placeholder for empty datasets or first-use onboarding.

```ts
{
  type: 'empty_state',
  key: 'no-connectors',
  data: {
    variant: 'first-use',
    icon: 'plug',
    title: 'No connectors yet',
    description: 'Connect your first external system to start syncing data.',
    cta: { label: 'Add Connector', href: '/connectors/new' },
  },
}
```

### markdown_panel

Rendered markdown content block for documentation or notes.

```ts
{
  type: 'markdown_panel',
  key: 'release-notes',
  data: {
    content: '## Release 5.0\n\n- New connector framework\n- Improved workflow editor\n- Bug fixes',
  },
}
```

### tabbed_panel

Tabbed container where each tab holds nested block descriptors.

```ts
{
  type: 'tabbed_panel',
  key: 'entity-tabs',
  data: {
    tabs: [
      {
        key: 'overview',
        label: 'Overview',
        blocks: [
          { type: 'detail_panel', key: 'tab-detail', data: { sections: [] } },
        ],
      },
      {
        key: 'activity',
        label: 'Activity',
        blocks: [
          { type: 'activity_timeline', key: 'tab-timeline', data: { events: [] } },
        ],
      },
    ],
  },
}
```

### action_grid

Grid of action cards for quick actions or navigation shortcuts.

```ts
{
  type: 'action_grid',
  key: 'quick-actions',
  data: {
    columns: 4,
    actions: [
      { id: 'new-user', label: 'Add User', icon: 'user-plus', href: '/users/new' },
      { id: 'import', label: 'Import CSV', icon: 'upload', href: '/import' },
      { id: 'export', label: 'Export Data', icon: 'download', href: '/export' },
      { id: 'settings', label: 'Settings', icon: 'settings', href: '/settings' },
    ],
  },
}
```

## Visualization

### metric_card

Single KPI display with value, label, and optional trend indicator.

```ts
{
  type: 'metric_card',
  key: 'total-users',
  data: {
    label: 'Total Users',
    value: '1,247',
    trend: { direction: 'up', value: '+12%', period: 'vs last month' },
    icon: 'users',
  },
}
```

### workflow_progress

Horizontal stepper showing linear workflow states with past (completed), current (active), and future (upcoming) visual treatment.

```ts
{
  type: 'workflow_progress',
  key: 'entitlement-lifecycle',
  data: {
    states: [
      { key: 'draft', label: 'Draft', timestamp: '2026-01-15' },
      { key: 'active', label: 'Active', timestamp: '2026-02-01' },
      { key: 'suspended', label: 'Suspended' },
      { key: 'expired', label: 'Expired' },
    ],
    currentState: 'active',
  },
}
```

### chart_panel

Multi-series chart supporting bar, line, area, and pie chart types. Lazy-loaded via Recharts (~555 KB chunk).

```ts
{
  type: 'chart_panel',
  key: 'revenue-chart',
  data: {
    chartType: 'bar',
    categoryKey: 'month',
    series: [
      { key: 'revenue', label: 'Revenue (R$)', color: 'var(--chart-1)', type: 'bar' },
      { key: 'users', label: 'Active Users', color: 'var(--chart-2)', type: 'line' },
    ],
    data: [
      { month: 'Jan', revenue: 19800, users: 2600 },
      { month: 'Feb', revenue: 24500, users: 2900 },
      { month: 'Mar', revenue: 28000, users: 3100 },
    ],
    showGrid: true,
    showLegend: true,
  },
}
```

### flow_editor

Visual workflow and node graph editor for automation pipelines. Lazy-loaded via @xyflow/react (~200 KB chunk).

```ts
{
  type: 'flow_editor',
  key: 'workflow-canvas',
  data: {
    nodes: [
      { id: 'trigger', type: 'trigger', label: 'New User', position: { x: 0, y: 0 } },
      { id: 'action1', type: 'action', label: 'Send Email', position: { x: 200, y: 0 } },
      { id: 'condition', type: 'condition', label: 'Has Manager?', position: { x: 400, y: 0 } },
    ],
    edges: [
      { source: 'trigger', target: 'action1' },
      { source: 'action1', target: 'condition' },
    ],
  },
}
```

## Interactive

### kanban_board

Drag-and-drop kanban board with columns and cards. Cards can be moved between columns via Inertia endpoint. Lazy-loaded via @dnd-kit (~15 KB chunk).

```ts
{
  type: 'kanban_board',
  key: 'sprint-board',
  data: {
    columns: [
      {
        id: 'todo',
        title: 'To Do',
        cards: [
          { id: 't-1', title: 'Fix login redirect', status: 'bug', statusIntent: 'destructive', assignee: 'Maria', dueDate: '2026-05-10' },
          { id: 't-2', title: 'Add dark mode toggle', description: 'User preference stored in localStorage', assignee: 'João' },
        ],
      },
      {
        id: 'in-progress',
        title: 'In Progress',
        cards: [
          { id: 't-3', title: 'Refactor auth middleware', status: 'in-progress', statusIntent: 'warning', assignee: 'Paulo' },
        ],
      },
      {
        id: 'done',
        title: 'Done',
        cards: [],
      },
    ],
    moveEndpoint: '/api/tasks/move',
  },
}
```

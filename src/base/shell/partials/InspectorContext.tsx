"use client";

import { createContext, useContext } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

export interface InspectorAction {
  id: string;
  label: string;
  icon?: string;
  href?: string;
}

export interface InspectorSection {
  id: string;
  title: string;
  fields: InspectorField[];
  actions?: InspectorAction[];
}

export interface InspectorField {
  key: string;
  label: string;
  value: string | number | boolean | null;
  kind?: "text" | "status" | "boolean" | "timestamp" | "link" | "badge" | "code";
}

export interface InspectorHeaderAction {
  id: string;
  label: string;
  icon?: string;
  variant?: "primary" | "ghost";
}

export interface InspectorResponse {
  title: string;
  /** Subtitle shown above title (e.g. "CON-104 · Conector"). */
  subtitle?: string;
  /** Status badge shown in status row below header. */
  badge?: string;
  /** Badge variant: 'success' | 'warning' | 'destructive' | 'info'. */
  badgeVariant?: "success" | "warning" | "destructive" | "info";
  /** Header-level actions (e.g. sync button). */
  headerActions?: InspectorHeaderAction[];
  /** Activity item count (shown on activity tab). */
  activityCount?: number;
  sections: InspectorSection[];
}

export interface InspectorContextValue {
  selectedId: string | number | null;
  select: (id: string | number) => void;
  close: () => void;
  enabled: boolean;
  data: InspectorResponse | null;
  loading: boolean;
  width: number;
}

// ── Context ──────────────────────────────────────────────────────────────────
//
// The Community engine owns the inspector CONTEXT (so Community blocks — DenseTable,
// CardGrid — can call useInspector() and degrade gracefully), but NOT the
// provider. The Pro @middag-io/react-pro InspectorProvider fills this context
// with real data fetching; without it, the no-op default keeps the inspector
// disabled. The Pro InspectorData config type lives in @middag-io/react-pro.

// eslint-disable-next-line react-refresh/only-export-components
export const InspectorContext = createContext<InspectorContextValue>({
  selectedId: null,
  select: () => {},
  close: () => {},
  enabled: false,
  data: null,
  loading: false,
  width: 380,
});

// eslint-disable-next-line react-refresh/only-export-components
export function useInspector(): InspectorContextValue {
  return useContext(InspectorContext);
}

// ── Generic inspector content renderer (exported for InlineInspector) ───────

export function InspectorFieldValue({ field }: { field: InspectorField }) {
  if (field.value === null || field.value === "") {
    return <span className="text-muted-foreground">---</span>;
  }

  if (field.kind === "boolean") {
    return <span>{field.value ? "✓" : "✗"}</span>;
  }

  if (field.kind === "status" || field.kind === "badge") {
    const color =
      field.value === "active" || field.value === "granted"
        ? "bg-success-subtle text-success"
        : field.value === "failed" || field.value === "revoked"
          ? "bg-destructive-subtle text-destructive"
          : "bg-muted text-muted-foreground";
    return (
      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${color}`}>
        {String(field.value)}
      </span>
    );
  }

  if (field.kind === "timestamp" && typeof field.value === "number") {
    return <span>{new Date(field.value * 1000).toLocaleDateString()}</span>;
  }

  if (field.kind === "code") {
    return (
      <code className="bg-muted rounded-[3px] px-1.5 py-px font-mono text-xs">
        {String(field.value)}
      </code>
    );
  }

  if (field.kind === "link" && typeof field.value === "string") {
    return (
      <a
        href={field.value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary truncate hover:underline"
      >
        {field.value.replace(/^https?:\/\//, "")}
      </a>
    );
  }

  return <span>{String(field.value)}</span>;
}

export function InspectorSectionContent({ sections }: { sections: InspectorSection[] }) {
  return (
    <div className="divide-y">
      {sections.map((section, index) => (
        // Section ids double as tab-group discriminators ("overview"/"activity"/
        // "config"), so a single tab can legitimately stack several sections
        // sharing an id — the render key must include the index to stay unique.
        <div key={`${section.id}-${index}`} className="px-4 py-3.5">
          <dl className="space-y-3.5">
            {section.fields.map((field) => (
              <div key={field.key}>
                <dt className="text-muted-foreground mb-0.5 text-[11px] font-medium tracking-[0.04em] uppercase">
                  {field.label}
                </dt>
                <dd className="text-foreground text-[13px]">
                  <InspectorFieldValue field={field} />
                </dd>
              </div>
            ))}
          </dl>
          {section.actions && section.actions.length > 0 && (
            <div className="mt-3.5 flex gap-1.5">
              {section.actions.map((action) => (
                <button
                  key={action.id}
                  className="border-border text-secondary-foreground hover:bg-muted rounded-md border px-2.5 py-[5px] text-xs font-medium transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

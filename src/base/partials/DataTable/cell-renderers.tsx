/**
 * Built-in cell renderers for DataTable column types.
 *
 * Each renderer conforms to CellRendererProps so it can be registered
 * in the cell registry. Consumers can register custom renderers for
 * new cell types without modifying DataTable.
 *
 * @see Page Builder v2 spec §Gap 5
 */

import type { ReactElement } from "react";
import { Cancel01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { router } from "@inertiajs/core";

import { getIcon } from "@/base/utils/icons";
import { formatTimestamp } from "@/base/utils/time";
import type {
  AnnotatedValue,
  LinkGroupItem,
  ProgressValue,
  RichStatusValue,
} from "@/contracts/block-data";
import { EntityLink } from "@/engine/EntityRoutes";
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/lib/utils";
import { Button } from "@/primitives/reui/button";

import type { CellRendererProps } from "./cell-registry";

// ---------------------------------------------------------------------------
// Status-to-badge mapping
// ---------------------------------------------------------------------------

type StatusSemantic = "success" | "warning" | "destructive" | "info" | "default" | "secondary";

/** Status pill classes using subtle bg + muted (darker) text for readable contrast. */
const STATUS_PILL_CLASSES: Record<StatusSemantic, string> = {
  success: "bg-success-subtle text-success",
  warning: "bg-warning-subtle text-warning",
  destructive: "bg-destructive-subtle text-destructive",
  info: "bg-info-subtle text-info",
  default: "bg-muted text-muted-foreground",
  secondary: "bg-muted text-muted-foreground",
};

const DEFAULT_STATUS_MAP: Record<string, StatusSemantic> = {
  // ---- success ----
  active: "success",
  enabled: "success",
  connected: "success",
  healthy: "success",
  success: "success",
  completed: "success",
  published: "success",
  approved: "success",
  paid: "success",
  granted: "success",
  delivered: "success",
  available: "success",
  yes: "success",
  // ---- warning ----
  pending: "warning",
  degraded: "warning",
  warning: "warning",
  low_stock: "warning",
  expiring: "warning",
  in_progress: "warning",
  slow: "warning",
  open: "warning",
  incomplete: "warning",
  outdated: "warning",
  // ---- secondary ----
  inactive: "secondary",
  disabled: "secondary",
  draft: "secondary",
  archived: "secondary",
  unknown: "secondary",
  closed: "secondary",
  no: "secondary",
  // ---- destructive ----
  error: "destructive",
  failed: "destructive",
  disconnected: "destructive",
  cancelled: "destructive",
  rejected: "destructive",
  blocked: "destructive",
  revoked: "destructive",
  expired: "destructive",
  abandoned: "destructive",
  bounced: "destructive",
  // PT-BR status labels (used by Moodle/WP consumers)
  ativo: "success",
  publicado: "success",
  "conclu\u00eddo": "success",
  pendente: "warning",
  rascunho: "secondary",
  arquivado: "secondary",
  inativo: "secondary",
  erro: "destructive",
  falhou: "destructive",
};

function resolveStatusSemantic(status: string, statusMap?: Record<string, string>): StatusSemantic {
  const merged = { ...DEFAULT_STATUS_MAP, ...statusMap };
  return (merged[status.toLowerCase()] ?? "secondary") as StatusSemantic;
}

// ---------------------------------------------------------------------------
// Cell renderers (CellRendererProps-compatible)
// ---------------------------------------------------------------------------

export function StatusCell({ value, column }: CellRendererProps): ReactElement {
  if (value == null) return <span className="text-muted-foreground">&mdash;</span>;
  const str = String(value);
  const semantic = resolveStatusSemantic(str, column.statusMap);
  const pillClass = STATUS_PILL_CLASSES[semantic];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[0.625rem] leading-none font-medium",
        pillClass,
      )}
    >
      {str}
    </span>
  );
}

export function BooleanCell({ value }: CellRendererProps): ReactElement {
  if (value == null) return <span className="text-muted-foreground">&mdash;</span>;
  return value ? (
    <HugeiconsIcon icon={Tick02Icon} className="text-success size-4" />
  ) : (
    <HugeiconsIcon icon={Cancel01Icon} className="text-muted-foreground size-4" />
  );
}

export function TimestampCell({ value, column }: CellRendererProps): ReactElement {
  const { locale } = useTranslation();
  if (value == null) return <span className="text-muted-foreground">&mdash;</span>;
  let ts = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(ts) && typeof value === "string") {
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) ts = Math.floor(parsed / 1000);
  }
  if (Number.isNaN(ts)) return <span className="text-muted-foreground">&mdash;</span>;
  return (
    <time dateTime={new Date(ts * 1000).toISOString()} title={new Date(ts * 1000).toLocaleString()}>
      {formatTimestamp(ts, column.timestampFormat, locale)}
    </time>
  );
}

export function LinkCell({ value, row, column }: CellRendererProps): ReactElement {
  if (value == null) return <span className="text-muted-foreground">&mdash;</span>;

  // Entity resolution (preferred)
  if (column.entityType && column.entityIdField && row) {
    const entityId = row[column.entityIdField];
    if (entityId != null) {
      return (
        <EntityLink type={column.entityType} id={entityId as string | number}>
          {String(value)}
        </EntityLink>
      );
    }
  }

  // Inline href fallback
  if (column.href && row) {
    const resolved = column.href.replace(/\{(\w+)\}/g, (_, key: string) => String(row[key] ?? ""));
    return (
      <a
        href={resolved}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          router.visit(resolved);
        }}
        className="text-primary hover:underline"
      >
        {String(value)}
      </a>
    );
  }

  return <span>{String(value)}</span>;
}

// ---------------------------------------------------------------------------
// Rich cell renderers (already CellRendererProps-compatible)
// ---------------------------------------------------------------------------

const APPEARANCE_TO_SEMANTIC: Record<string, StatusSemantic> = {
  success: "success",
  warning: "warning",
  danger: "destructive",
  info: "info",
  neutral: "secondary",
};

export function RichStatusCell({ value }: CellRendererProps): ReactElement {
  if (value == null) return <span className="text-muted-foreground">&mdash;</span>;

  const data = value as RichStatusValue;
  const semantic = APPEARANCE_TO_SEMANTIC[data.appearance] ?? "secondary";
  const pillClass = STATUS_PILL_CLASSES[semantic];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[0.625rem] leading-none font-medium",
        pillClass,
      )}
    >
      {data.label}
    </span>
  );
}

export function HtmlCell({ value }: CellRendererProps): ReactElement {
  if (value == null || value === "") {
    return <span className="text-muted-foreground">&mdash;</span>;
  }

  return <span dangerouslySetInnerHTML={{ __html: String(value) }} />;
}

export function LinkGroupCell({ value }: CellRendererProps): ReactElement {
  if (!Array.isArray(value) || value.length === 0) {
    return <span className="text-muted-foreground">&mdash;</span>;
  }

  const items = value as LinkGroupItem[];
  const visible = items.filter((item) => item.href != null);

  if (visible.length === 0) {
    return <span className="text-muted-foreground">&mdash;</span>;
  }

  return (
    <div className="flex items-center justify-center gap-1">
      {visible.map((item) => (
        <Button key={item.label} variant="ghost" size="icon-xs" asChild title={item.label}>
          <a
            href={item.href!}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
          >
            <HugeiconsIcon
              icon={getIcon(item.icon) as unknown as IconSvgElement}
              className="size-3.5"
            />
          </a>
        </Button>
      ))}
    </div>
  );
}

const ANNOTATED_APPEARANCE: Record<string, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
  info: "text-info",
  neutral: "text-muted-foreground",
};

export function AnnotatedCell({ value }: CellRendererProps): ReactElement {
  if (value == null) return <span className="text-muted-foreground">&mdash;</span>;

  // Graceful fallback: plain string → render as text
  if (typeof value === "string" || typeof value === "number") {
    return <span>{String(value)}</span>;
  }

  const data = value as AnnotatedValue;
  const colorClass = data.appearance ? ANNOTATED_APPEARANCE[data.appearance] : undefined;

  return (
    <div className="flex items-center gap-2">
      {data.badge && (
        <span
          className="inline-flex size-[18px] shrink-0 items-center justify-center rounded text-[10px] font-bold text-white"
          style={{ background: data.badge.color }}
        >
          {data.badge.label}
        </span>
      )}
      <div className="min-w-0">
        <span className={colorClass ? `font-medium ${colorClass}` : "font-medium"}>
          {data.text}
        </span>
        {data.sublabel && (
          <span className="text-muted-foreground block truncate font-mono text-[11px]">
            {data.sublabel}
          </span>
        )}
      </div>
    </div>
  );
}

const PROGRESS_BAR_CLASSES: Record<string, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  info: "bg-info",
  neutral: "bg-primary",
};

export function ProgressCell({ value }: CellRendererProps): ReactElement {
  if (value == null) return <span className="text-muted-foreground">&mdash;</span>;

  // Accept either a structured ProgressValue or a bare number (treated as the value out of 100).
  // Arrays and other non-object types fall through to the em-dash fallback.
  let data: ProgressValue;
  if (typeof value === "number") {
    data = { value };
  } else if (typeof value === "object" && !Array.isArray(value)) {
    data = value as ProgressValue;
  } else if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return <span className="text-muted-foreground">&mdash;</span>;
    data = { value: parsed };
  } else {
    return <span className="text-muted-foreground">&mdash;</span>;
  }

  if (typeof data.value !== "number" || Number.isNaN(data.value)) {
    return <span className="text-muted-foreground">&mdash;</span>;
  }

  const max = data.max != null && data.max > 0 ? data.max : 100;
  const pct = Math.max(0, Math.min(100, (data.value / max) * 100));
  const label = data.label ?? `${Math.round(pct)}%`;
  const barClass = PROGRESS_BAR_CLASSES[data.appearance ?? "neutral"];

  return (
    <div className="flex items-center gap-2">
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="bg-muted relative h-1.5 w-full min-w-[60px] flex-1 overflow-hidden rounded-full"
      >
        <div
          className={cn("h-full rounded-full transition-all", barClass)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-muted-foreground w-9 shrink-0 text-right text-[11px] tabular-nums">
        {label}
      </span>
    </div>
  );
}

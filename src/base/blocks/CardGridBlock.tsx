/**
 * CardGridBlock — contract-driven card grid with variant support.
 *
 * Renders rows as clickable cards in a responsive grid.
 * When an InspectorContext is available, clicking a card opens the inspector.
 *
 * Variants control visual layout:
 * - 'default': generic key-value card
 * - 'store': ecommerce store card with logo, stats, status badge
 * - 'connector': connector card with type icon and health indicator
 *
 * @see ADR-807
 */

"use client";

import { useMemo, type ReactElement } from "react";
import { Link } from "@inertiajs/react";

import type { BlockProps } from "@/app/registries";
import { useInspector } from "@/base/shell/partials/InspectorContext";
import type { CardGridBlockData, CardGridColumnDef } from "@/contracts/block-data";
import { cn } from "@/lib/utils";

export function CardGridBlock({ block }: BlockProps<CardGridBlockData>): ReactElement {
  const { data } = block;
  const { select, selectedId, enabled } = useInspector();
  const variant = data.variant ?? "default";

  if (data.rows.length === 0 && data.emptyState) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        {data.emptyState.title && (
          <h3 className="text-lg font-semibold">{data.emptyState.title}</h3>
        )}
        {data.emptyState.description && (
          <p className="text-muted-foreground mt-1 text-sm">{data.emptyState.description}</p>
        )}
        {data.emptyState.cta && (
          <Link
            href={data.emptyState.cta.href}
            className="bg-primary text-primary-foreground mt-4 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium"
          >
            {data.emptyState.cta.label}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
      {data.rows.map((row, index) => {
        // Preserve the row id verbatim — it may be a string/UUID, not just a
        // number — so selection works for non-numeric ids. Rows without an id
        // fall back to the index for a stable, unique React key and are not
        // selectable.
        const id = row.id as string | number | undefined;
        const key = id != null ? String(id) : `row-${index}`;
        const isSelected = enabled && id != null && selectedId === id;

        return (
          <button
            key={key}
            type="button"
            onClick={() => enabled && id != null && select(id)}
            className={cn(
              "bg-card text-card-foreground cursor-pointer rounded-lg border p-5 text-left transition-all",
              "hover:border-primary/50 hover:shadow-sm",
              isSelected && "border-primary ring-primary/20 ring-2",
            )}
          >
            <CardContent row={row} columns={data.columns} variant={variant} />
          </button>
        );
      })}
    </div>
  );
}

// ── Card variants ────────────────────────────────────────────────────────────

function CardContent({
  row,
  columns,
  variant,
}: {
  row: Record<string, unknown>;
  columns: CardGridColumnDef[];
  variant: string;
}): ReactElement {
  if (variant === "store") {
    return <StoreCard row={row} />;
  }

  if (variant === "connector") {
    return <ConnectorCard row={row} />;
  }

  // Default variant: render columns as key-value pairs
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">{String(row.fullname ?? row.name ?? row.title ?? "")}</h3>
      {columns
        .filter((col) => col.key !== "id" && col.key !== "fullname")
        .map((col) => (
          <div key={col.key} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{col.label}</span>
            <span className="font-medium">{formatValue(row[col.key], col.kind)}</span>
          </div>
        ))}
    </div>
  );
}

function StoreCard({ row }: { row: Record<string, unknown> }): ReactElement {
  const provider = String(row.provider_type ?? row.idnumber ?? "");
  const status = String(row.status ?? "inactive");
  const initial = provider.charAt(0).toUpperCase() || "S";

  const logoColor = useMemo(() => {
    const colors: Record<string, string> = {
      woocommerce: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      eduzz: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      digitalmanagerguru: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    };
    return (
      colors[provider.toLowerCase()] ??
      "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
    );
  }, [provider]);

  const statusColor =
    status === "active"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
      : status === "error"
        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
        : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";

  return (
    <>
      <div className="mb-3 flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-md text-sm font-bold",
            logoColor,
          )}
        >
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold">{String(row.fullname ?? "")}</div>
          <div className="text-muted-foreground text-xs tracking-wider uppercase">{provider}</div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t pt-3">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            statusColor,
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {status}
        </span>
      </div>
    </>
  );
}

function ConnectorCard({ row }: { row: Record<string, unknown> }): ReactElement {
  const type = String(row.connector_type ?? "");
  const extension = String(row.extension ?? "");
  const status = String(row.status ?? "unconfigured");
  const latency = row.latency_ms != null ? `${row.latency_ms}ms` : "—";
  const initial = type.charAt(0).toUpperCase() || "C";

  const typeColor = useMemo(() => {
    const colors: Record<string, string> = {
      http_api: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      oauth2: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      webhook: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
      sdk: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    };
    return (
      colors[type.toLowerCase()] ?? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
    );
  }, [type]);

  const statusColor =
    status === "connected"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
      : status === "degraded"
        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
        : status === "disconnected" || status === "error"
          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";

  return (
    <>
      <div className="mb-3 flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-md text-sm font-bold",
            typeColor,
          )}
        >
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold">{String(row.fullname ?? "")}</div>
          <div className="text-muted-foreground text-xs">
            {type} · {extension}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t pt-3">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            statusColor,
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {status}
        </span>
        <span className="text-muted-foreground text-xs">{latency}</span>
      </div>
    </>
  );
}

function formatValue(value: unknown, kind?: string): string {
  if (value === null || value === undefined) return "—";
  if (kind === "boolean") return value ? "✓" : "✗";
  if (kind === "timestamp" && typeof value === "number") {
    return new Date(value * 1000).toLocaleDateString();
  }
  return String(value);
}

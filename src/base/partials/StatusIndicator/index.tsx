/**
 * StatusIndicator — colored dot/icon with optional label.
 *
 * Used by DataTable status cells, detail panels, and anywhere status display is needed.
 *
 * @see NV-05-ux-blocks.md §1.2
 */

import type { ReactElement } from "react";

import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/lib/utils";

export type IndicatorSize = "sm" | "md";

export interface StatusIndicatorProps {
  status: string;
  label?: string;
  size?: IndicatorSize;
}

const STATUS_COLORS: Record<string, string> = {
  connected: "bg-success",
  active: "bg-success",
  healthy: "bg-success",
  success: "bg-success",
  degraded: "bg-warning",
  warning: "bg-warning",
  pending: "bg-warning",
  disconnected: "bg-destructive",
  failed: "bg-destructive",
  error: "bg-destructive",
  inactive: "bg-muted-foreground",
  unknown: "bg-muted-foreground",
};

function getStatusColor(status: string): string {
  return STATUS_COLORS[status.toLowerCase()] ?? "bg-muted-foreground";
}

export function StatusIndicator({
  status,
  label,
  size = "sm",
}: StatusIndicatorProps): ReactElement {
  const { t } = useTranslation();
  const dotSize = size === "sm" ? "h-2 w-2" : "h-4 w-4";

  return (
    <span
      className="inline-flex items-center gap-2"
      aria-label={t("middag.ui.status.label", { value: label ?? status })}
    >
      <span
        className={cn("shrink-0 rounded-full", dotSize, getStatusColor(status))}
        aria-hidden="true"
      />
      {label && <span className="text-foreground text-sm">{label}</span>}
    </span>
  );
}

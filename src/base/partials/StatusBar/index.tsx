/**
 * StatusBar — horizontal strip of status indicators with colored dots.
 *
 * @see NV-05-ux-blocks.md §5.1–5.8
 */

import type { ReactElement } from "react";

import { Skeleton } from "@/components/reui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/reui/tooltip";
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/lib/utils";

export type StatusAppearance = "success" | "warning" | "danger" | "info" | "neutral";

export interface StatusBarItem {
  key: string;
  label: string;
  value: string;
  appearance: StatusAppearance;
  tooltip?: string;
  href?: string;
}

export interface StatusBarProps {
  items: StatusBarItem[];
  isLoading?: boolean;
}

const DOT_COLORS: Record<StatusAppearance, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  info: "bg-info",
  neutral: "bg-muted-foreground",
};

function StatusBarItemComponent({ item }: { item: StatusBarItem }): ReactElement {
  const { t } = useTranslation();
  const content = (
    <span
      className="flex items-center gap-2"
      aria-label={t("middag.ui.status.item", {
        label: item.label,
        value: item.value,
        appearance: t(`middag.ui.status.appearance_${item.appearance}`),
      })}
    >
      <span
        className={cn("h-2 w-2 shrink-0 rounded-full", DOT_COLORS[item.appearance])}
        aria-hidden="true"
      />
      <span className="text-muted-foreground text-xs">{item.label}</span>
      <span className="text-sm font-semibold">{item.value}</span>
    </span>
  );

  if (item.tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {item.href ? (
              <a
                href={item.href}
                className="hover:bg-accent/50 rounded-md px-2 py-1 transition-colors"
              >
                {content}
              </a>
            ) : (
              <span className="px-2 py-1">{content}</span>
            )}
          </TooltipTrigger>
          <TooltipContent>{item.tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (item.href) {
    return (
      <a href={item.href} className="hover:bg-accent/50 rounded-md px-2 py-1 transition-colors">
        {content}
      </a>
    );
  }

  return <span className="px-2 py-1">{content}</span>;
}

export function StatusBar({ items, isLoading }: StatusBarProps): ReactElement | null {
  const { t } = useTranslation();
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-4" role="status" aria-label={t("middag.ui.status.system")}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className={cn("h-4", i % 2 === 0 ? "w-28" : "w-20")} />
        ))}
      </div>
    );
  }

  if (items.length === 0) return null;

  const allDanger = items.every((item) => item.appearance === "danger");

  return (
    <div
      role="status"
      aria-label={t("middag.ui.status.system")}
      className={cn(
        "flex flex-wrap gap-4",
        allDanger && "border-destructive/20 bg-destructive-subtle/20 rounded-md border p-2",
      )}
    >
      {items.map((item) => (
        <StatusBarItemComponent key={item.key} item={item} />
      ))}
    </div>
  );
}

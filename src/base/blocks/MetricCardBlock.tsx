/**
 * MetricCardBlock — KPI card with value, delta, icon, and optional link.
 *
 * @see NV-05-ux-blocks.md §3.1–3.7
 */

import type { ReactElement } from "react";
import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@inertiajs/react";

import { getIcon } from "@/base/utils/icons";
import { Card, CardContent, CardHeader } from "@/components/reui/card";
import { Skeleton } from "@/components/reui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/reui/tooltip";
import type { MetricCardBlockData } from "@/contracts/block-data";
import type { BlockProps } from "@/engine/registries";
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/lib/utils";

function inferDeltaDirection(
  delta?: string,
  explicit?: "positive" | "negative" | "neutral",
): "positive" | "negative" | "neutral" {
  if (explicit) return explicit;
  if (!delta) return "neutral";
  if (delta.startsWith("+") || delta.startsWith("↑")) return "positive";
  if (delta.startsWith("-") || delta.startsWith("↓")) return "negative";
  return "neutral";
}

function formatValue(value: string | number, locale = "pt-BR", compact = false): string {
  if (typeof value === "string") return value;
  if (compact || value >= 100_000) {
    return new Intl.NumberFormat(locale, { notation: "compact" }).format(value);
  }
  return new Intl.NumberFormat(locale).format(value);
}

const DELTA_STYLES = {
  positive: "text-success",
  negative: "text-destructive",
  neutral: "text-muted-foreground",
};

export function MetricCardBlock({ block }: BlockProps<MetricCardBlockData>): ReactElement {
  const { t } = useTranslation();
  const { data, meta } = block;
  const isLoading = meta?.loading === true;
  const direction = inferDeltaDirection(data.delta, data.deltaDirection);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-5 rounded" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>
    );
  }

  const formattedValue = formatValue(data.value, data.locale, data.compact);

  const cardContent = (
    <Card
      className={cn(
        "gap-3 py-4 transition-shadow duration-150",
        data.href && "hover:bg-accent/50 cursor-pointer hover:shadow-sm",
      )}
    >
      <CardHeader className="pb-0">
        {data.icon && (
          <HugeiconsIcon icon={getIcon(data.icon)} size={18} className="text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-xs">{data.label}</p>
        <p className="text-foreground text-2xl leading-tight font-bold tabular-nums">
          {formattedValue}
        </p>
        {data.delta && (
          <p className={cn("mt-1 flex items-center gap-1 text-xs", DELTA_STYLES[direction])}>
            {direction === "positive" && <HugeiconsIcon icon={ArrowUp01Icon} size={12} />}
            {direction === "negative" && <HugeiconsIcon icon={ArrowDown01Icon} size={12} />}
            {data.delta}
          </p>
        )}
      </CardContent>
    </Card>
  );

  if (data.href) {
    const ariaLabel =
      direction === "neutral"
        ? t("middag.ui.metric.aria_value", { label: data.label, value: formattedValue })
        : t(
            direction === "positive"
              ? "middag.ui.metric.aria_increase"
              : "middag.ui.metric.aria_decrease",
            { label: data.label, value: formattedValue, delta: data.delta },
          );

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={data.href} aria-label={ariaLabel}>
              {cardContent}
            </Link>
          </TooltipTrigger>
          <TooltipContent>{t("middag.ui.metric.view_details")}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return cardContent;
}

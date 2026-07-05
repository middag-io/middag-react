/**
 * ActivityTimelineBlock — grouped activity timeline.
 *
 * Renders timeline entries grouped by date. Supports load more via Inertia partial reload.
 * Stub implementation until TimelineList partial is available.
 *
 * @see NV-05-ux-blocks.md §6
 */

import { useState, type ReactElement } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { router } from "@inertiajs/core";
import { usePage } from "@inertiajs/react";

import type { BlockProps } from "@/app/registries";
import { EmptyPlaceholder } from "@/base/partials/EmptyPlaceholder";
import { getIcon } from "@/base/utils/icons";
import { formatISO, formatRelativeTime } from "@/base/utils/time";
import { Button } from "@/components/reui/button";
import { Skeleton } from "@/components/reui/skeleton";
import type { ActivityTimelineBlockData } from "@/contracts/block-data";
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/lib/utils";

const COLOR_MAP: Record<string, string> = {
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
  destructive: "bg-destructive",
  neutral: "bg-muted",
};

export function ActivityTimelineBlock({
  block,
}: BlockProps<ActivityTimelineBlockData>): ReactElement {
  const { t, locale } = useTranslation();
  const { meta, key } = block;
  // Honor Inertia v3 prop merging. Load-more reloads the top-level prop named
  // `key` (see handleLoadMore `only: [key]`); when the backend marks it with
  // `mergeProps`/`prependProps`/`deepMergeProps`, Inertia core accumulates the
  // entries onto the live page prop before render. Read that merged value when
  // present, falling back to the contract-embedded data on initial render (or
  // when the host keeps the timeline payload inside the PageContract).
  const pageProps = usePage().props as Record<string, unknown>;
  const data = (pageProps[key] as ActivityTimelineBlockData | undefined) ?? block.data;
  const isLoading = meta?.loading === true;
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Optimistic read state. Clicking "mark as read" acknowledges the entry
  // locally (so the action flips to a "Read" marker immediately) and POSTs to the
  // entry's markReadHref to persist. Server-confirmed entries arrive with read=true.
  const [ackedIds, setAckedIds] = useState<Set<string>>(new Set());

  const handleMarkRead = (href: string, id: string) => {
    setAckedIds((prev) => new Set(prev).add(id));
    router.post(href, {}, { preserveState: true, preserveScroll: true, only: [key] });
  };

  const handleLoadMore = () => {
    if (!data.loadMoreHref) return;
    setIsLoadingMore(true);
    router.get(
      data.loadMoreHref,
      {},
      {
        preserveState: true,
        preserveScroll: true,
        only: [key],
        onFinish: () => setIsLoadingMore(false),
      },
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const allEntries = data.groups.flatMap((g) => g.entries);
  if (allEntries.length === 0) {
    return (
      <EmptyPlaceholder variant="inline" icon="clock" title={t("middag.ui.activity.no_activity")} />
    );
  }

  return (
    <ol role="list" aria-label={t("middag.ui.activity.timeline_label")} className="space-y-6">
      {data.groups.map((group) => (
        <li key={group.label}>
          <h3 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase">
            {group.label}
          </h3>
          <ol className="space-y-3">
            {group.entries.map((entry) => (
              <li
                key={entry.id}
                className="hover:bg-accent/50 flex gap-3 rounded-md p-2 transition-colors"
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                    COLOR_MAP[entry.color] ?? "bg-muted",
                  )}
                >
                  <HugeiconsIcon icon={getIcon(entry.icon)} size={14} className="text-white" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm">
                      {entry.actorHref ? (
                        <a
                          href={entry.actorHref}
                          className="text-primary font-semibold hover:underline"
                        >
                          {entry.actor || t("middag.ui.activity.system_actor")}
                        </a>
                      ) : (
                        <span className="font-semibold">
                          {entry.actor || t("middag.ui.activity.system_actor")}
                        </span>
                      )}{" "}
                      {entry.action}
                    </p>
                    <time
                      dateTime={formatISO(entry.timestamp)}
                      className="text-muted-foreground shrink-0 text-xs"
                      title={formatISO(entry.timestamp)}
                    >
                      {formatRelativeTime(entry.timestamp, locale)}
                    </time>
                  </div>
                  {entry.markReadHref &&
                    (entry.read || ackedIds.has(entry.id) ? (
                      <span className="text-muted-foreground mt-1 inline-block text-xs">
                        {t("middag.ui.activity.read")}
                      </span>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-1 h-auto px-2 py-0.5 text-xs"
                        onClick={() => handleMarkRead(entry.markReadHref!, entry.id)}
                      >
                        {t("middag.ui.activity.mark_read")}
                      </Button>
                    ))}
                </div>
              </li>
            ))}
          </ol>
        </li>
      ))}

      {data.hasMore && (
        <li className="flex justify-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            aria-label={t("middag.ui.activity.load_more_label")}
          >
            {isLoadingMore ? t("middag.ui.loading") : t("middag.ui.load_more")}
          </Button>
        </li>
      )}
    </ol>
  );
}

/**
 * TimelineList — grouped timeline of activity entries.
 *
 * Renders entries grouped by date, connected by a vertical timeline line.
 * Each entry has a colored icon node, actor, timestamp, action, and optional detail.
 *
 * @see NV-05-ux-blocks.md §6 (timeline anatomy)
 */

import { useState, type ReactElement } from "react";
import { ArrowDown01Icon, ArrowRight01Icon, InboxIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@inertiajs/react";

import { EmptyPlaceholder } from "@/base/partials/EmptyPlaceholder";
import { getIcon } from "@/base/utils/icons";
import { formatISO, formatRelativeTime } from "@/base/utils/time";
import { Button } from "@/components/reui/button";
import { Skeleton } from "@/components/reui/skeleton";
import { Spinner } from "@/components/reui/spinner";
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

export interface TimelineEntry {
  id: string;
  actor: string;
  actorHref?: string;
  action: string;
  detail?: string;
  icon?: string;
  color?: string;
  timestamp: number;
}

export interface TimelineGroup {
  label: string;
  entries: TimelineEntry[];
}

export interface TimelineListProps {
  groups: TimelineGroup[];
  isLoading?: boolean;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
}

/* ------------------------------------------------------------------ */
/*  Color mapping                                                     */
/* ------------------------------------------------------------------ */

const NODE_COLORS: Record<string, string> = {
  success: "bg-success text-white",
  warning: "bg-warning text-white",
  error: "bg-destructive text-white",
  destructive: "bg-destructive text-white",
  info: "bg-info text-white",
  primary: "bg-primary text-primary-foreground",
  muted: "bg-muted-foreground/20 text-muted-foreground",
};

function resolveNodeColor(color?: string): string {
  if (!color) return NODE_COLORS.muted;
  return NODE_COLORS[color.toLowerCase()] ?? NODE_COLORS.muted;
}

/* ------------------------------------------------------------------ */
/*  EntryDetail (collapsible)                                         */
/* ------------------------------------------------------------------ */

function EntryDetail({ detail, entryId }: { detail: string; entryId: string }): ReactElement {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const contentId = `timeline-detail-${entryId}`;

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls={contentId}
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs"
      >
        <HugeiconsIcon
          icon={expanded ? ArrowDown01Icon : ArrowRight01Icon}
          size={10}
          aria-hidden="true"
        />
        <span>
          {expanded ? t("middag.ui.timeline.hide_details") : t("middag.ui.timeline.show_details")}
        </span>
      </button>

      {expanded && (
        <div
          id={contentId}
          className="bg-muted/50 text-muted-foreground mt-1.5 rounded px-3 py-2 text-xs"
        >
          {detail}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TimelineEntryRow                                                  */
/* ------------------------------------------------------------------ */

function TimelineEntryRow({
  entry,
  isLast,
}: {
  entry: TimelineEntry;
  isLast: boolean;
}): ReactElement {
  const { locale } = useTranslation();
  const iconData = entry.icon ? getIcon(entry.icon) : InboxIcon;
  const nodeColor = resolveNodeColor(entry.color);

  return (
    <li className="relative flex gap-4 pb-6 last:pb-0">
      {/* Vertical connecting line */}
      {!isLast && (
        <div className="bg-border absolute top-7 -bottom-1 left-3 w-0.5" aria-hidden="true" />
      )}

      {/* Node circle with icon */}
      <div
        className={cn(
          "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
          nodeColor,
        )}
        aria-hidden="true"
      >
        <HugeiconsIcon icon={iconData} size={12} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pt-0.5">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          {/* Actor */}
          {entry.actorHref ? (
            <Link
              href={entry.actorHref}
              className="text-foreground text-sm font-semibold hover:underline"
            >
              {entry.actor}
            </Link>
          ) : (
            <span className="text-foreground text-sm font-semibold">{entry.actor}</span>
          )}

          {/* Action */}
          <span className="text-muted-foreground text-sm">{entry.action}</span>

          {/* Timestamp */}
          <time
            dateTime={formatISO(entry.timestamp)}
            title={formatISO(entry.timestamp)}
            className="text-muted-foreground ml-auto shrink-0 text-xs"
          >
            {formatRelativeTime(entry.timestamp, locale)}
          </time>
        </div>

        {/* Collapsible detail */}
        {entry.detail && <EntryDetail detail={entry.detail} entryId={entry.id} />}
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/*  Skeleton                                                          */
/* ------------------------------------------------------------------ */

function TimelineListSkeleton(): ReactElement {
  return (
    <div className="space-y-6">
      <Skeleton className="h-4 w-20" />
      <div className="space-y-4 pl-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export function TimelineList({
  groups,
  isLoading,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: TimelineListProps): ReactElement {
  const { t } = useTranslation();

  if (isLoading) {
    return <TimelineListSkeleton />;
  }

  // Empty state
  if (groups.length === 0 || groups.every((g) => g.entries.length === 0)) {
    return (
      <EmptyPlaceholder
        variant="no-results"
        icon="clock"
        title={t("middag.ui.timeline.no_activity")}
        description={t("middag.ui.timeline.no_activity_description")}
      />
    );
  }

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <section key={group.label} aria-label={group.label}>
          {/* Date group header */}
          <h4 className="text-muted-foreground mb-4 text-xs font-semibold tracking-wide uppercase">
            {group.label}
          </h4>

          {/* Entries */}
          <ol className="space-y-0">
            {group.entries.map((entry, idx) => (
              <TimelineEntryRow
                key={entry.id}
                entry={entry}
                isLast={idx === group.entries.length - 1}
              />
            ))}
          </ol>
        </section>
      ))}

      {/* Load more */}
      {hasMore && onLoadMore && (
        <div className="flex justify-center pt-2">
          <Button variant="outline" size="sm" onClick={onLoadMore} disabled={isLoadingMore}>
            {isLoadingMore ? (
              <>
                <Spinner className="mr-2" />
                {t("middag.ui.loading")}
              </>
            ) : (
              t("middag.ui.load_more")
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

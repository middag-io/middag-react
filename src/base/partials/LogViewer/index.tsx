/**
 * LogViewer — reusable log content viewer with severity badges, JSON collapsible, raw mode.
 *
 * Receives parsed lines from server (log_reader_service::read_file).
 * Available for dependent plugins at system/partials/LogViewer.
 *
 * @see ADR-924, logs-redesign-design.md
 */

import { useEffect, useRef, useState, type ReactElement } from "react";

import { Skeleton } from "@/components/reui/skeleton";

import { LogEntry } from "./LogEntry";
import { LogViewerToolbar } from "./LogViewerToolbar";
import type { LogViewerProps } from "./types";

export { type LogViewerProps } from "./types";
export { type ParsedLogLine, type LogSeverity } from "./types";

export function LogViewer({
  lines,
  filename,
  downloadUrl,
  totalLines,
  hasMore,
  isLoading = false,
  onLoadMore,
  onClose,
}: LogViewerProps): ReactElement {
  const [rawMode, setRawMode] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const rawContent = lines
    .map((l) => {
      if (l.level === "RAW") return l.message;
      const ctx = Object.keys(l.context).length > 0 ? " " + JSON.stringify(l.context) : "";
      return `[${l.datetime}] [${l.origin}] [${l.actor}] ${l.level}: ${l.message}${ctx}`;
    })
    .join("\n");

  useEffect(() => {
    if (!hasMore || !onLoadMore || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          onLoadMore();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, onLoadMore, isLoading]);

  if (isLoading && lines.length === 0) {
    return (
      <div className="flex flex-col rounded-lg border">
        <div className="border-border flex items-center gap-2 border-b px-3 py-2">
          <Skeleton className="h-4 w-32" />
          <div className="flex-1" />
          <Skeleton className="h-6 w-16" />
        </div>
        <div className="space-y-2 p-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-lg border">
      <LogViewerToolbar
        filename={filename}
        totalLines={totalLines}
        downloadUrl={downloadUrl}
        rawMode={rawMode}
        onToggleRaw={() => setRawMode(!rawMode)}
        rawContent={rawContent}
        onClose={onClose}
      />

      <div className="max-h-[70vh] overflow-y-auto">
        {rawMode ? (
          <pre className="p-3 font-mono text-xs whitespace-pre-wrap">{rawContent}</pre>
        ) : (
          <div className="divide-border divide-y">
            {lines.map((line, i) => (
              <LogEntry key={i} line={line} />
            ))}
          </div>
        )}

        {hasMore && (
          <div ref={sentinelRef} className="flex justify-center py-3">
            {isLoading ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              <span className="text-muted-foreground text-xs">Scroll for more…</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

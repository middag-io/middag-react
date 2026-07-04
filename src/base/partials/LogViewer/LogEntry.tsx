/**
 * LogEntry — single parsed log line with severity badge, timestamp, and context.
 */

import type { ReactElement } from "react";

import { Badge } from "@/components/reui/badge";

import { JsonBlock } from "./JsonBlock";
import type { LogSeverity, ParsedLogLine } from "./types";

type BadgeVariant =
  | "destructive-light"
  | "warning-light"
  | "info-light"
  | "invert-light"
  | "secondary";

const SEVERITY_VARIANT: Record<string, BadgeVariant> = {
  ERROR: "destructive-light",
  CRITICAL: "destructive-light",
  WARNING: "warning-light",
  INFO: "info-light",
  DEBUG: "invert-light",
  NOTICE: "invert-light",
  RAW: "secondary",
};

function getSeverityVariant(level: LogSeverity | string): BadgeVariant {
  return SEVERITY_VARIANT[level] ?? "secondary";
}

export function LogEntry({ line }: { line: ParsedLogLine }): ReactElement {
  const hasContext =
    line.context != null &&
    typeof line.context === "object" &&
    (Array.isArray(line.context) ? line.context.length > 0 : Object.keys(line.context).length > 0);

  return (
    <div className="group hover:bg-accent/30 flex items-start gap-2 px-3 py-1.5 font-mono text-xs">
      <Badge
        variant={getSeverityVariant(line.level)}
        size="xs"
        className="mt-0.5 shrink-0 font-mono"
      >
        {line.level.substring(0, 5).padEnd(5)}
      </Badge>

      {line.datetime && <span className="text-muted-foreground shrink-0">{line.datetime}</span>}

      {line.origin && (
        <span className="text-muted-foreground shrink-0">
          {line.origin}
          {line.actor ? `.${line.actor}` : ""}
        </span>
      )}

      <span className="flex-1 break-words">
        <span>{line.message}</span>
        {hasContext && (
          <span className="ml-1">
            <JsonBlock data={line.context as Record<string, unknown>} />
          </span>
        )}
      </span>
    </div>
  );
}

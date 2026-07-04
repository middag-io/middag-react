/**
 * JsonBlock — collapsible JSON payload display.
 */

import { useState, type ReactElement } from "react";

import { cn } from "@/lib/utils";

export function JsonBlock({ data }: { data: Record<string, unknown> | unknown[] }): ReactElement {
  const [expanded, setExpanded] = useState(false);
  const json = JSON.stringify(data, null, 2);
  const keys = Array.isArray(data) ? data : Object.keys(data);

  if (keys.length === 0) {
    return <></>;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "rounded px-1 py-0.5 font-mono text-xs transition-colors",
          expanded
            ? "bg-muted text-foreground"
            : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        {expanded ? "▾ context" : "{…}"}
      </button>
      {expanded && (
        <pre className="bg-muted/30 mt-1 block w-full overflow-x-auto rounded p-2 font-mono text-xs">
          {json}
        </pre>
      )}
    </>
  );
}

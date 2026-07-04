/**
 * WorkflowProgressBlock — horizontal stepper showing linear workflow states.
 *
 * Renders a sequence of states with past (completed), current (active),
 * and future (upcoming) visual treatment. Each state can show a timestamp.
 *
 * Promoted from middag-account StatusWorkflow to shared lib.
 *
 * @see NV-05-ux-blocks.md §17
 */

import type { ReactElement } from "react";

import type { BlockProps } from "@/app/registries";
import type { WorkflowProgressBlockData } from "@/contracts/block-data";

export function WorkflowProgressBlock({
  block,
}: BlockProps<WorkflowProgressBlockData>): ReactElement {
  const { states, currentState } = block.data;
  // currentState should match one of states[].key, but a stale or unknown
  // value from the backend yields -1. Treat that as "not started": no node is
  // marked past or current and no aria-current is emitted, rather than
  // mis-highlighting or crashing.
  const currentIndex = states.findIndex((s) => s.key === currentState);

  return (
    <div role="list" className="flex items-center">
      {states.map((state, index) => {
        const isPast = currentIndex !== -1 && index < currentIndex;
        const isCurrent = currentIndex !== -1 && index === currentIndex;

        return (
          <div
            key={state.key}
            role="listitem"
            aria-current={isCurrent ? "step" : undefined}
            className="flex items-center"
          >
            {/* State node */}
            <div className="flex flex-col items-center">
              <div
                className={[
                  "flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors",
                  isPast
                    ? "border-success bg-success text-white"
                    : isCurrent
                      ? "border-primary bg-primary/10 text-primary ring-primary/20 ring-2"
                      : "border-muted-foreground/30 bg-background text-muted-foreground/50",
                ].join(" ")}
              >
                {isPast && (
                  <svg
                    aria-hidden="true"
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {isCurrent && (
                  <div aria-hidden="true" className="bg-primary h-2 w-2 rounded-full" />
                )}
              </div>

              {/* Label */}
              <span
                className={[
                  "mt-1.5 text-[12px] whitespace-nowrap",
                  isPast
                    ? "text-foreground font-medium"
                    : isCurrent
                      ? "text-primary font-semibold"
                      : "text-muted-foreground",
                ].join(" ")}
              >
                {state.label}
              </span>

              {/* Timestamp */}
              {state.timestamp && (isPast || isCurrent) && (
                <span className="text-muted-foreground mt-0.5 text-[11px]">{state.timestamp}</span>
              )}
            </div>

            {/* Connector line (not after last state) — decorative */}
            {index < states.length - 1 && (
              <div
                aria-hidden="true"
                className={[
                  "mx-2 w-8 md:w-12",
                  isPast
                    ? "bg-success h-0.5"
                    : "border-muted-foreground/30 h-0 border-t border-dashed",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/**
 * StatRow — responsive grid container for MetricCardBlock instances.
 *
 * @see NV-05-ux-screens-core.md T-01 metrics region
 */

import type { ReactElement, ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface StatRowProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
}

const COLUMN_CLASSES: Record<number, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export function StatRow({ children, columns }: StatRowProps): ReactElement {
  const gridClass = columns
    ? COLUMN_CLASSES[columns]
    : "grid-cols-[repeat(auto-fit,minmax(200px,1fr))]";

  return <div className={cn("grid gap-6", gridClass)}>{children}</div>;
}

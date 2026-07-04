/**
 * StaticField -- read-only display of a value.
 *
 * Renders the value as a paragraph, not as an interactive control.
 */

import type { ReactElement } from "react";

export interface StaticFieldProps {
  id: string;
  value: unknown;
}

export function StaticField({ id, value }: StaticFieldProps): ReactElement {
  const displayValue = value === null || value === undefined ? "\u2014" : String(value);

  return (
    <p
      id={id}
      className="border-input bg-muted/50 text-foreground rounded-md border px-3 py-2 text-sm"
    >
      {displayValue}
    </p>
  );
}

/**
 * SliderField -- numeric range input (single value or two-thumb range).
 *
 * Wraps the ReUI Slider (Radix) primitive with form-field aria plumbing.
 * Radix works in arrays internally; this field accepts/returns a scalar for
 * single mode and a [from, to] tuple when `multiple` is set.
 */

import type { ReactElement } from "react";

import { Slider } from "@/primitives/reui/slider";

export interface SliderFieldProps {
  id: string;
  value: number | number[] | null;
  onChange: (value: number | number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpTextId?: string;
  errorId?: string;
}

export function SliderField({
  id,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  multiple = false,
  disabled,
  required,
  error,
  helpTextId,
  errorId,
}: SliderFieldProps): ReactElement {
  const describedBy =
    [error ? errorId : undefined, helpTextId].filter(Boolean).join(" ") || undefined;

  const arrayValue = Array.isArray(value)
    ? value
    : value == null
      ? multiple
        ? [min, max]
        : [min]
      : [value];

  const display = multiple ? arrayValue.join(" – ") : String(arrayValue[0] ?? min);

  return (
    <div className="flex items-center gap-4">
      <Slider
        id={id}
        value={arrayValue}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onValueChange={(vals: number[]) => onChange(multiple ? vals : (vals[0] ?? min))}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy}
      />
      <span
        aria-hidden="true"
        className="text-muted-foreground min-w-12 text-right text-sm tabular-nums"
      >
        {display}
      </span>
    </div>
  );
}

/**
 * NumberField -- numeric input with increment/decrement controls.
 *
 * Wraps the ReUI NumberField (Base UI) primitive.
 */

import type { ReactElement } from "react";

import {
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberField as NumberFieldPrimitive,
} from "@/components/reui/number-field";

export interface NumberFieldProps {
  id: string;
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpTextId?: string;
  errorId?: string;
}

export function NumberFieldComponent({
  id,
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled,
  required,
  error,
  helpTextId,
  errorId,
}: NumberFieldProps): ReactElement {
  const describedBy =
    [error ? errorId : undefined, helpTextId].filter(Boolean).join(" ") || undefined;

  return (
    <NumberFieldPrimitive
      id={id}
      value={value ?? undefined}
      onValueChange={(val) => onChange(val ?? null)}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      aria-invalid={error ? true : undefined}
      aria-required={required || undefined}
      aria-describedby={describedBy}
    >
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberFieldPrimitive>
  );
}

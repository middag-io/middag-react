/**
 * DateRangeField — date range selector with filter operators and presets.
 *
 * Uses ReUI DateSelector for rich date filtering (is, before, after, between).
 * Lazy-loaded in FormField.tsx — date-fns is in the lazy chunk.
 */

import { useCallback, type ReactElement } from "react";

import {
  DateSelector,
  type DateSelectorFilterType,
  type DateSelectorValue,
} from "@/primitives/reui/date-selector";

export interface DateRangeFieldProps {
  id: string;
  value: unknown;
  onChange: (value: unknown) => void;
  operator?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpTextId?: string;
  errorId?: string;
}

export function DateRangeField({
  id,
  value,
  onChange,
  operator,
  required,
  error,
  helpTextId,
  errorId,
}: DateRangeFieldProps): ReactElement {
  const describedBy =
    [error ? errorId : undefined, helpTextId].filter(Boolean).join(" ") || undefined;

  const handleChange = useCallback(
    (val: DateSelectorValue) => {
      onChange(val);
    },
    [onChange],
  );

  return (
    <div
      id={id}
      aria-required={required || undefined}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
    >
      <DateSelector
        value={value as DateSelectorValue | undefined}
        onChange={handleChange}
        allowRange
        defaultFilterType={(operator as DateSelectorFilterType) ?? "is"}
        presetMode={operator ? (operator as DateSelectorFilterType) : undefined}
        showInput
      />
    </div>
  );
}

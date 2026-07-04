/**
 * RadioField -- radio group for single selection from options.
 *
 * Wraps the ReUI RadioGroup (Radix) primitive with form-field aria plumbing.
 */

import type { ReactElement } from "react";

import { Label } from "@/components/reui/label";
import { RadioGroup, RadioGroupItem } from "@/components/reui/radio-group";

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpTextId?: string;
  errorId?: string;
}

export function RadioField({
  id,
  value,
  onChange,
  options,
  disabled,
  required,
  error,
  helpTextId,
  errorId,
}: RadioFieldProps): ReactElement {
  const describedBy =
    [error ? errorId : undefined, helpTextId].filter(Boolean).join(" ") || undefined;

  return (
    <RadioGroup
      id={id}
      value={value ?? ""}
      onValueChange={onChange}
      disabled={disabled}
      aria-invalid={error ? true : undefined}
      aria-required={required || undefined}
      aria-describedby={describedBy}
    >
      {options.map((opt) => {
        const itemId = `${id}-${opt.value}`;
        return (
          <div key={opt.value} className="flex items-center gap-2">
            <RadioGroupItem value={opt.value} id={itemId} />
            <Label htmlFor={itemId} className="text-sm font-normal">
              {opt.label}
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
}

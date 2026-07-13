/**
 * CheckboxField -- single boolean checkbox with label.
 *
 * Wraps the ReUI Checkbox (Radix) primitive with form-field aria plumbing.
 */

import type { ReactElement } from "react";

import { Checkbox } from "@/primitives/reui/checkbox";
import { Label } from "@/primitives/reui/label";

export interface CheckboxFieldProps {
  id: string;
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpTextId?: string;
  errorId?: string;
}

export function CheckboxField({
  id,
  value,
  onChange,
  label,
  disabled,
  required,
  error,
  helpTextId,
  errorId,
}: CheckboxFieldProps): ReactElement {
  const describedBy =
    [error ? errorId : undefined, helpTextId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={id}
        checked={!!value}
        onCheckedChange={(checked) => onChange(checked === true)}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy}
      />
      {label && (
        <Label htmlFor={id} className="text-sm font-normal">
          {label}
        </Label>
      )}
    </div>
  );
}

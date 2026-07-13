/**
 * SwitchField -- boolean toggle switch with label.
 *
 * Wraps the ReUI Switch (Radix) primitive with form-field aria plumbing.
 */

import type { ReactElement } from "react";

import { Label } from "@/primitives/reui/label";
import { Switch } from "@/primitives/reui/switch";

export interface SwitchFieldProps {
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

export function SwitchField({
  id,
  value,
  onChange,
  label,
  disabled,
  required,
  error,
  helpTextId,
  errorId,
}: SwitchFieldProps): ReactElement {
  const describedBy =
    [error ? errorId : undefined, helpTextId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex items-center gap-2">
      <Switch
        id={id}
        checked={!!value}
        onCheckedChange={onChange}
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

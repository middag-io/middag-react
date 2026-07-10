/**
 * TextareaField -- multiline text input.
 *
 * Wraps the ReUI Textarea primitive with form-field aria plumbing.
 */

import type { ReactElement } from "react";

import { Textarea } from "@/primitives/reui/textarea";

export interface TextareaFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: string;
  helpTextId?: string;
  errorId?: string;
}

export function TextareaField({
  id,
  value,
  onChange,
  placeholder,
  rows = 4,
  disabled,
  readOnly,
  required,
  error,
  helpTextId,
  errorId,
}: TextareaFieldProps): ReactElement {
  const describedBy =
    [error ? errorId : undefined, helpTextId].filter(Boolean).join(" ") || undefined;

  return (
    <Textarea
      id={id}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      readOnly={readOnly}
      aria-invalid={error ? true : undefined}
      aria-required={required || undefined}
      aria-describedby={describedBy}
    />
  );
}

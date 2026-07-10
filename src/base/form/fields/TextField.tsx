/**
 * TextField -- text/email/url input field.
 *
 * Wraps the ReUI Input primitive with form-field aria plumbing.
 */

import type { ReactElement } from "react";

import { Input } from "@/primitives/reui/input";

export interface TextFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "url";
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: string;
  helpTextId?: string;
  errorId?: string;
}

export function TextField({
  id,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled,
  readOnly,
  required,
  error,
  helpTextId,
  errorId,
}: TextFieldProps): ReactElement {
  const describedBy =
    [error ? errorId : undefined, helpTextId].filter(Boolean).join(" ") || undefined;

  return (
    <Input
      id={id}
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      aria-invalid={error ? true : undefined}
      aria-required={required || undefined}
      aria-describedby={describedBy}
    />
  );
}

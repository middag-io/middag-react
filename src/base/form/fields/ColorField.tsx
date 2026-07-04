/**
 * ColorField -- color picker with hex input and visual preview.
 *
 * Uses native color input with a text fallback for hex values.
 */

import { useCallback, type ReactElement } from "react";

import { Input } from "@/components/reui/input";

export interface ColorFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpTextId?: string;
  errorId?: string;
}

export function ColorField({
  id,
  value,
  onChange,
  placeholder,
  disabled,
  required,
  error,
  helpTextId,
  errorId,
}: ColorFieldProps): ReactElement {
  const describedBy =
    [error ? errorId : undefined, helpTextId].filter(Boolean).join(" ") || undefined;

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value || "#000000"}
        onChange={handleColorChange}
        disabled={disabled}
        className="border-input h-9 w-9 shrink-0 cursor-pointer rounded-md border p-0.5"
        aria-label="Color picker"
      />
      <Input
        id={id}
        type="text"
        value={value ?? ""}
        onChange={handleTextChange}
        placeholder={placeholder ?? "#000000"}
        disabled={disabled}
        maxLength={7}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy}
        className="font-mono"
      />
    </div>
  );
}

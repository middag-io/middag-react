/**
 * SlugField — URL-friendly slug input with auto-generation.
 *
 * Normalizes input: lowercase, replaces spaces/special chars with hyphens,
 * removes consecutive hyphens. Uses ReUI InputGroup for the URL prefix.
 */

import { useCallback, useEffect, useState, type ReactElement } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/primitives/reui/input-group";

/** Convert a string to a URL-friendly slug. */
function toSlug(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export interface SlugFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  /** Source value to auto-generate slug from (e.g. title field). */
  sourceValue?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpTextId?: string;
  errorId?: string;
  prefix?: string;
}

export function SlugField({
  id,
  value,
  onChange,
  sourceValue,
  placeholder,
  disabled,
  required,
  error,
  helpTextId,
  errorId,
  prefix,
}: SlugFieldProps): ReactElement {
  const [manualEdit, setManualEdit] = useState(false);
  const describedBy =
    [error ? errorId : undefined, helpTextId].filter(Boolean).join(" ") || undefined;

  // Auto-generate from source unless user has manually edited
  useEffect(() => {
    if (!manualEdit && sourceValue !== undefined) {
      const next = toSlug(sourceValue);
      if (next !== value) {
        onChange(next);
      }
    }
  }, [sourceValue, manualEdit, onChange, value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setManualEdit(true);
      onChange(toSlug(e.target.value));
    },
    [onChange],
  );

  if (!prefix) {
    return (
      <InputGroup data-disabled={disabled || undefined}>
        <InputGroupInput
          id={id}
          type="text"
          value={value ?? ""}
          onChange={handleChange}
          placeholder={placeholder ?? "url-friendly-slug"}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-required={required || undefined}
          aria-describedby={describedBy}
        />
      </InputGroup>
    );
  }

  return (
    <InputGroup data-disabled={disabled || undefined}>
      <InputGroupAddon align="inline-start">
        <InputGroupText>{prefix}</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput
        id={id}
        type="text"
        value={value ?? ""}
        onChange={handleChange}
        placeholder={placeholder ?? "url-friendly-slug"}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy}
      />
    </InputGroup>
  );
}

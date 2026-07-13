/**
 * NativeSelectField -- single-value select using the native HTML <select>.
 *
 * Fallback for contexts where the styled (Radix portal) Select misbehaves —
 * notably inside Moodle iframes. Wraps the ReUI NativeSelect primitive with
 * form-field aria plumbing. Mirrors SelectField's option contract.
 */

import type { ChangeEvent, ReactElement } from "react";

import type { SelectOption } from "@/base/form/fields/SelectField";
import { useTranslation } from "@/i18n/useTranslation";
import { NativeSelect, NativeSelectOption } from "@/primitives/reui/native-select";

export interface NativeSelectFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpTextId?: string;
  errorId?: string;
}

export function NativeSelectField({
  id,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  required,
  error,
  helpTextId,
  errorId,
}: NativeSelectFieldProps): ReactElement {
  const { t } = useTranslation();
  const describedBy =
    [error ? errorId : undefined, helpTextId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="w-full [&>div]:w-full">
      <NativeSelect
        id={id}
        value={value ?? ""}
        onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange(event.target.value)}
        disabled={disabled}
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      >
        <NativeSelectOption value="" disabled={required}>
          {placeholder ?? t("middag.ui.form.select_placeholder")}
        </NativeSelectOption>
        {options.map((option) => (
          <NativeSelectOption key={option.value} value={option.value}>
            {option.label}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  );
}

/**
 * SelectField -- single-value select dropdown.
 *
 * Wraps the ReUI Select (Radix) primitive with form-field aria plumbing.
 */

import type { ReactElement } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/reui/select";
import { useTranslation } from "@/i18n/useTranslation";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps {
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

export function SelectField({
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
}: SelectFieldProps): ReactElement {
  const { t } = useTranslation();
  const describedBy =
    [error ? errorId : undefined, helpTextId].filter(Boolean).join(" ") || undefined;

  return (
    <Select value={value ?? ""} onValueChange={onChange} disabled={disabled} required={required}>
      <SelectTrigger
        id={id}
        className="w-full"
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy}
      >
        <SelectValue placeholder={placeholder ?? t("middag.ui.form.select_placeholder")} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

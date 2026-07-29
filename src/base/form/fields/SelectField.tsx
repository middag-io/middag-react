/**
 * SelectField -- single-value select dropdown.
 *
 * Wraps the ReUI Select (Radix) primitive with form-field aria plumbing.
 */

import type { ReactElement } from "react";

import { useTranslation } from "@/i18n/useTranslation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/primitives/reui/select";

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
      {/* popper, not the primitive's item-aligned default: item-aligned lays the
          list over the trigger (aligning the selected option to it), so in a form
          the open menu covers the field it belongs to and reads as a misplaced
          overlay. A form field should drop its options below itself. */}
      <SelectContent position="popper" sideOffset={4} align="start" className="w-full">
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

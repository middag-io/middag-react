/**
 * PhoneField — international phone input with country flag selector.
 *
 * Uses the ReUI PhoneInput component (Combobox country search + flags).
 * Value is E.164 format (e.g. "+5511999999999").
 *
 * Two modes:
 *   - Multi-country (default): user selects country from searchable dropdown
 *   - Fixed country (fixedCountry: true): country locked, no selector shown
 */

import { type ReactElement } from "react";
import type { Value } from "react-phone-number-input";

import { useTranslation } from "@/i18n/useTranslation";
import { PhoneInput } from "@/primitives/reui/phone-input";

export interface PhoneFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpTextId?: string;
  errorId?: string;
  defaultCountry?: string;
  fixedCountry?: boolean;
}

export function PhoneField({
  id,
  value,
  onChange,
  placeholder,
  disabled,
  required,
  error,
  helpTextId,
  errorId,
  defaultCountry = "BR",
  fixedCountry,
}: PhoneFieldProps): ReactElement {
  const { t } = useTranslation();
  const describedBy =
    [error ? errorId : undefined, helpTextId].filter(Boolean).join(" ") || undefined;

  return (
    <PhoneInput
      id={id}
      value={(value as Value) ?? ""}
      onChange={(val) => onChange((val as string) ?? "")}
      defaultCountry={defaultCountry as never}
      international={!fixedCountry}
      countryCallingCodeEditable={!fixedCountry}
      placeholder={placeholder ?? t("middag.ui.form.phone_placeholder")}
      disabled={disabled}
      aria-invalid={error ? true : undefined}
      aria-required={required || undefined}
      aria-describedby={describedBy}
    />
  );
}

/**
 * CurrencyField — numeric input with locale-aware currency formatting.
 *
 * Displays formatted value (e.g. "R$ 1.234,56") when not focused,
 * raw number when editing. Uses ReUI InputGroup for the currency symbol prefix.
 */

import { useCallback, useState, type ReactElement } from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/reui/input-group";
import { useTranslation } from "@/i18n/useTranslation";

export interface CurrencyFieldProps {
  id: string;
  value: number | null;
  onChange: (value: number | null) => void;
  currency?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpTextId?: string;
  errorId?: string;
  min?: number;
  max?: number;
}

/** Map common ISO currency codes to their symbols. */
const CURRENCY_SYMBOLS: Record<string, string> = {
  BRL: "R$",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
  KRW: "₩",
  INR: "₹",
  MXN: "$",
  ARS: "$",
  CLP: "$",
  COP: "$",
  PEN: "S/",
};

export function CurrencyField({
  id,
  value,
  onChange,
  currency = "BRL",
  placeholder,
  disabled,
  required,
  error,
  helpTextId,
  errorId,
  min,
  max,
}: CurrencyFieldProps): ReactElement {
  const { t, formatCurrency } = useTranslation();
  const [focused, setFocused] = useState(false);
  const [rawInput, setRawInput] = useState("");

  const describedBy =
    [error ? errorId : undefined, helpTextId].filter(Boolean).join(" ") || undefined;

  const displayValue = focused
    ? rawInput
    : value !== null && value !== undefined
      ? formatCurrency(value, currency)
      : "";

  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;

  const handleFocus = useCallback(() => {
    setFocused(true);
    setRawInput(value !== null && value !== undefined ? String(value) : "");
  }, [value]);

  const handleBlur = useCallback(() => {
    setFocused(false);
    const parsed = parseFloat(rawInput.replace(/,/g, "."));
    if (Number.isNaN(parsed)) {
      onChange(null);
    } else {
      const clamped =
        min !== undefined && parsed < min ? min : max !== undefined && parsed > max ? max : parsed;
      onChange(Math.round(clamped * 100) / 100);
    }
  }, [rawInput, onChange, min, max]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRawInput(e.target.value);
  }, []);

  return (
    <InputGroup data-disabled={disabled || undefined}>
      <InputGroupAddon align="inline-start">
        <InputGroupText>{symbol}</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput
        id={id}
        inputMode="decimal"
        value={
          focused
            ? rawInput
            : value !== null && value !== undefined
              ? displayValue.replace(symbol, "").trim()
              : ""
        }
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder ?? t("middag.ui.form.currency_placeholder")}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy}
      />
    </InputGroup>
  );
}

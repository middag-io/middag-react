/**
 * useTranslation — the library hook.
 *
 * t / i18n come from react-i18next; the native Intl formatters are preserved
 * from the previous provider API. tAsync is removed (no retrocompat): use
 * useHostString for lazy host strings.
 */
import { useCallback, useMemo } from "react";
import { useTranslation as useReactI18next } from "react-i18next";
import { type TFunction } from "i18next";

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31536000],
  ["month", 2592000],
  ["week", 604800],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
  ["second", 1],
];

function toDate(value: Date | number | string): Date {
  return value instanceof Date ? value : new Date(value);
}

export interface UseTranslationResult {
  t: TFunction;
  locale: string;
  formatDate: (value: Date | number | string, options?: Intl.DateTimeFormatOptions) => string;
  formatDateTime: (value: Date | number | string, options?: Intl.DateTimeFormatOptions) => string;
  formatRelative: (value: Date | number | string) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (value: number, currency?: string, options?: Intl.NumberFormatOptions) => string;
}

export function useTranslation(): UseTranslationResult {
  const { t, i18n } = useReactI18next(undefined, { useSuspense: false });
  const locale = i18n.resolvedLanguage ?? i18n.language;

  const formatDate = useCallback(
    (value: Date | number | string, options?: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat(locale, options ?? { dateStyle: "medium" }).format(toDate(value)),
    [locale],
  );
  const formatDateTime = useCallback(
    (value: Date | number | string, options?: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat(
        locale,
        options ?? { dateStyle: "medium", timeStyle: "short" },
      ).format(toDate(value)),
    [locale],
  );
  const formatRelative = useCallback(
    (value: Date | number | string) => {
      const seconds = Math.round((toDate(value).getTime() - Date.now()) / 1000);
      for (const [unit, threshold] of RELATIVE_UNITS) {
        if (Math.abs(seconds) >= threshold) {
          return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
            Math.round(seconds / threshold),
            unit,
          );
        }
      }
      return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(0, "second");
    },
    [locale],
  );
  const formatNumber = useCallback(
    (value: number, options?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat(locale, options).format(value),
    [locale],
  );
  const formatCurrency = useCallback(
    (value: number, currency = "BRL", options?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat(locale, { style: "currency", currency, ...options }).format(value),
    [locale],
  );

  return useMemo(
    () => ({ t, locale, formatDate, formatDateTime, formatRelative, formatNumber, formatCurrency }),
    [t, locale, formatDate, formatDateTime, formatRelative, formatNumber, formatCurrency],
  );
}

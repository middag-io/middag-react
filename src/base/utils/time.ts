/**
 * Time formatting utilities — locale-aware relative and absolute timestamps.
 *
 * Locale-aware via Intl.RelativeTimeFormat / Intl.DateTimeFormat. Callers pass
 * the active locale (from I18nProvider's `useTranslation().locale`); it defaults
 * to "en" so non-React utilities and tests stay deterministic.
 *
 * formatRelativeTime() keeps the hybrid scale used by timeline/timestamp
 * displays:
 * - < 1 min: "now" / "agora"
 * - < 1h: "N minutes ago" / "há N minutos"
 * - < 24h: time of day (locale short time)
 * - yesterday: "yesterday, <time>"
 * - < 30 days: "<day month>, <time>"
 * - >= 30 days: "<day month year>"
 *
 * @see NV-05-ux-blocks.md §6 (timeline timestamps)
 */

import type { TimestampFormat } from "@/contracts/block-data";

const MINUTE = 60;
const HOUR = 3600;
const DAY = 86400;

const DEFAULT_LOCALE = "en";

function timeOfDay(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { timeStyle: "short" }).format(date);
}

function dayMonth(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" }).format(date);
}

function dayMonthYear(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

/** Localized relative word: format(0, "second") → "now"/"agora", (-1, "day") → "yesterday"/"ontem". */
function relativeWord(amount: number, unit: Intl.RelativeTimeFormatUnit, locale: string): string {
  return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(amount, unit);
}

function isYesterday(date: Date, now: Date): boolean {
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Format a Unix timestamp (seconds) as relative/absolute text on the hybrid scale.
 */
export function formatRelativeTime(timestamp: number, locale: string = DEFAULT_LOCALE): string {
  if (!Number.isFinite(timestamp)) return "";
  const now = Date.now() / 1000;
  const diff = Math.floor(now - timestamp);
  const date = new Date(timestamp * 1000);
  const nowDate = new Date();

  if (diff < MINUTE) return relativeWord(0, "second", locale);
  if (diff < HOUR) {
    const mins = Math.floor(diff / MINUTE);
    return new Intl.RelativeTimeFormat(locale, { numeric: "always" }).format(-mins, "minute");
  }
  if (diff < DAY) return timeOfDay(date, locale);
  if (isYesterday(date, nowDate)) {
    return `${relativeWord(-1, "day", locale)}, ${timeOfDay(date, locale)}`;
  }
  if (diff < DAY * 30) return `${dayMonth(date, locale)}, ${timeOfDay(date, locale)}`;
  return dayMonthYear(date, locale);
}

/**
 * Return ISO 8601 string from a Unix timestamp (seconds).
 * Used as tooltip/title for <time datetime>. Locale-independent.
 */
export function formatISO(timestamp: number): string {
  if (!Number.isFinite(timestamp)) return "";
  return new Date(timestamp * 1000).toISOString();
}

/**
 * Format a Unix timestamp (seconds) using one of the supported display formats.
 * "relative" delegates to formatRelativeTime; the others are absolute and
 * locale-aware (or ISO for "iso").
 */
export function formatTimestamp(
  timestamp: number,
  format: TimestampFormat = "relative",
  locale: string = DEFAULT_LOCALE,
): string {
  if (!Number.isFinite(timestamp)) return "";
  const date = new Date(timestamp * 1000);
  switch (format) {
    case "iso":
      return date.toISOString();
    case "date":
      return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
    case "time":
      return new Intl.DateTimeFormat(locale, { timeStyle: "short" }).format(date);
    case "datetime":
      return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(
        date,
      );
    case "relative":
    default:
      return formatRelativeTime(timestamp, locale);
  }
}

/**
 * Return a date group label for timeline grouping.
 * "today" / "yesterday" (localized) or "<day month year>".
 */
export function formatDateGroupLabel(timestamp: number, locale: string = DEFAULT_LOCALE): string {
  if (!Number.isFinite(timestamp)) return "";
  const date = new Date(timestamp * 1000);
  const now = new Date();

  if (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  ) {
    return relativeWord(0, "day", locale);
  }

  if (isYesterday(date, now)) return relativeWord(-1, "day", locale);
  return dayMonthYear(date, locale);
}

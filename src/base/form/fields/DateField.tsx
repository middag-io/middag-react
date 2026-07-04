/**
 * DateField — date/datetime input with Calendar popover.
 *
 * Uses ReUI Calendar + Popover + date-fns format/parse.
 * Value: ISO 8601 string (YYYY-MM-DD for date, YYYY-MM-DDTHH:mm for datetime).
 */

import { useCallback, useState, type ReactElement } from "react";
import { format, isValid, parse } from "date-fns";

import { Button } from "@/components/reui/button";
import { Calendar } from "@/components/reui/calendar";
import { Input } from "@/components/reui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/reui/popover";
import { useTranslation } from "@/i18n/useTranslation";

export interface DateFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  mode?: "date" | "datetime";
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpTextId?: string;
  errorId?: string;
}

const DATE_FORMAT = "yyyy-MM-dd";
const DISPLAY_FORMAT = "MMM d, yyyy";

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export function DateField({
  id,
  value,
  onChange,
  mode = "date",
  placeholder,
  disabled,
  required,
  error,
  helpTextId,
  errorId,
}: DateFieldProps): ReactElement {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const describedBy =
    [error ? errorId : undefined, helpTextId].filter(Boolean).join(" ") || undefined;

  // Parse current value to Date object
  const dateValue = value ? parse(value.split("T")[0], DATE_FORMAT, new Date()) : undefined;
  const selectedDate = dateValue && isValid(dateValue) ? dateValue : undefined;

  // Time portion (for datetime mode)
  const timePart =
    mode === "datetime" && value?.includes("T") ? value.split("T")[1]?.slice(0, 5) : "";

  const handleDateSelect = useCallback(
    (date: Date | undefined) => {
      if (!date) {
        onChange("");
        setOpen(false);
        return;
      }
      const dateStr = format(date, DATE_FORMAT);
      if (mode === "datetime") {
        onChange(`${dateStr}T${timePart || "00:00"}`);
      } else {
        onChange(dateStr);
      }
      if (mode === "date") setOpen(false);
    },
    [onChange, mode, timePart],
  );

  const handleTimeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const time = e.target.value;
      const dateStr = value?.split("T")[0] ?? format(new Date(), DATE_FORMAT);
      onChange(`${dateStr}T${time}`);
    },
    [onChange, value],
  );

  const handleClear = useCallback(() => {
    onChange("");
    setOpen(false);
  }, [onChange]);

  const displayValue = selectedDate
    ? mode === "datetime" && timePart
      ? `${format(selectedDate, DISPLAY_FORMAT)} ${timePart}`
      : format(selectedDate, DISPLAY_FORMAT)
    : "";

  const defaultPlaceholder =
    mode === "datetime"
      ? t("middag.ui.form.datetime_placeholder")
      : t("middag.ui.form.date_placeholder");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="relative">
        <PopoverTrigger asChild>
          <button
            type="button"
            id={id}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-required={required || undefined}
            aria-describedby={describedBy}
            className="border-input bg-background ring-ring focus:ring-ring flex h-9 w-full items-center rounded-md border px-3 py-1 text-sm shadow-xs transition-colors focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span
              className={
                displayValue
                  ? "text-foreground flex-1 text-left"
                  : "text-muted-foreground flex-1 text-left"
              }
            >
              {displayValue || placeholder || defaultPlaceholder}
            </span>
            <CalendarIcon />
          </button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            captionLayout="dropdown"
          />

          {mode === "datetime" && (
            <div className="border-border flex items-center gap-2 border-t px-3 py-2">
              <Input
                type="time"
                value={timePart}
                onChange={handleTimeChange}
                placeholder={t("middag.ui.form.time_placeholder")}
                className="h-8 w-auto"
              />
            </div>
          )}

          <div className="border-border flex justify-between border-t px-3 py-2">
            <Button type="button" variant="ghost" size="sm" onClick={handleClear}>
              {t("middag.ui.form.date_clear")}
            </Button>
          </div>
        </PopoverContent>
      </div>
    </Popover>
  );
}

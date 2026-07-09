/**
 * MultiSelectField — multi-value selection with searchable dropdown.
 *
 * Uses ReUI Combobox in multi-select mode with chips for selected items.
 * Falls back to checkbox list for ≤8 options without search.
 */

import { useCallback, useMemo, useState, type ReactElement } from "react";
import type { TFunction } from "i18next";

import { Badge } from "@/components/reui/badge";
import { Checkbox } from "@/components/reui/checkbox";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/reui/combobox";
import { Label } from "@/components/reui/label";
import { useTranslation } from "@/i18n/useTranslation";

export interface MultiSelectFieldProps {
  id: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpTextId?: string;
  errorId?: string;
  /**
   * Rendering mode. "auto" (default) uses a checkbox list for small option sets
   * and the searchable combobox for large ones; "combobox" / "checkbox" force it.
   */
  variant?: "auto" | "combobox" | "checkbox";
}

const CHECKBOX_THRESHOLD = 8;

export function MultiSelectField({
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
  variant = "auto",
}: MultiSelectFieldProps): ReactElement {
  const { t } = useTranslation();
  const selected = value ?? [];

  const describedBy =
    [error ? errorId : undefined, helpTextId].filter(Boolean).join(" ") || undefined;

  // Checkbox list for small sets (auto) or when forced; combobox otherwise.
  const useCheckbox =
    variant === "checkbox" || (variant === "auto" && options.length <= CHECKBOX_THRESHOLD);
  if (useCheckbox) {
    return (
      <CheckboxList
        id={id}
        options={options}
        selected={selected}
        onChange={onChange}
        disabled={disabled}
        required={required}
        error={error}
        describedBy={describedBy}
        t={t}
      />
    );
  }

  // For larger sets, use Combobox with chips + search
  return (
    <ComboboxMultiSelect
      id={id}
      options={options}
      selected={selected}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      error={error}
      describedBy={describedBy}
      t={t}
    />
  );
}

// ── Checkbox list (≤8 options) ──────────────────────────────────────────────

function CheckboxList({
  id,
  options,
  selected,
  onChange,
  disabled,
  required,
  error,
  describedBy,
  t,
}: {
  id: string;
  options: Array<{ value: string; label: string }>;
  selected: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  describedBy?: string;
  t: TFunction;
}): ReactElement {
  const toggle = (optValue: string) => {
    if (selected.includes(optValue)) {
      onChange(selected.filter((v) => v !== optValue));
    } else {
      onChange([...selected, optValue]);
    }
  };

  return (
    <div
      id={id}
      role="group"
      aria-invalid={error ? true : undefined}
      aria-required={required || undefined}
      aria-describedby={describedBy}
      className="border-input max-h-48 space-y-2 overflow-y-auto rounded-md border p-3"
    >
      {options.map((opt) => (
        <div key={opt.value} className="flex items-center gap-2">
          <Checkbox
            id={`${id}-${opt.value}`}
            checked={selected.includes(opt.value)}
            onCheckedChange={() => toggle(opt.value)}
            disabled={disabled}
          />
          <Label htmlFor={`${id}-${opt.value}`} className="text-sm font-normal">
            {opt.label}
          </Label>
        </div>
      ))}
      {options.length === 0 && (
        <p className="text-muted-foreground text-sm">{t("middag.ui.multiselect.no_options")}</p>
      )}
    </div>
  );
}

// ── Combobox multi-select (>8 options) ──────────────────────────────────────

function ComboboxMultiSelect({
  id,
  options,
  selected,
  onChange,
  placeholder,
  disabled,
  required,
  error,
  describedBy,
  t,
}: {
  id: string;
  options: Array<{ value: string; label: string }>;
  selected: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  describedBy?: string;
  t: TFunction;
}): ReactElement {
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    const q = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search]);

  const selectedLabels = useMemo(() => {
    const map = new Map(options.map((o) => [o.value, o.label]));
    return selected.map((v) => ({ value: v, label: map.get(v) ?? v }));
  }, [selected, options]);

  const handleRemove = useCallback(
    (val: string) => {
      onChange(selected.filter((v) => v !== val));
    },
    [selected, onChange],
  );

  const handleItemToggle = useCallback(
    (val: string | null) => {
      if (!val) return;
      if (selected.includes(val)) {
        onChange(selected.filter((v) => v !== val));
      } else {
        onChange([...selected, val]);
      }
    },
    [selected, onChange],
  );

  return (
    <div
      id={id}
      aria-invalid={error ? true : undefined}
      aria-required={required || undefined}
      aria-describedby={describedBy}
      className="space-y-2"
    >
      {/* Selected chips */}
      {selectedLabels.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedLabels.map((item) => (
            <Badge key={item.value} variant="secondary" className="gap-1 pr-1">
              {item.label}
              <button
                type="button"
                onClick={() => handleRemove(item.value)}
                className="text-muted-foreground hover:text-foreground ml-0.5 rounded-full"
                aria-label={t("middag.ui.form.multiselect_remove", { label: item.label })}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-3 w-3"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search combobox — filtering is done manually above (filteredOptions),
          so disable Base UI's built-in filter to keep the empty state in sync. */}
      <Combobox items={filteredOptions} value={null} onValueChange={handleItemToggle} filter={null}>
        <ComboboxInput
          placeholder={placeholder ?? t("middag.ui.form.multiselect_search")}
          disabled={disabled}
          showTrigger
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ComboboxContent>
          <ComboboxEmpty className="px-4 py-3 text-sm">
            {t("middag.ui.form.entity_no_results")}
          </ComboboxEmpty>
          <ComboboxList>
            {filteredOptions.map((option) => (
              <ComboboxItem
                key={option.value}
                value={option.value}
                className="flex items-center gap-2"
              >
                <Checkbox
                  checked={selected.includes(option.value)}
                  tabIndex={-1}
                  className="pointer-events-none"
                />
                <span className="text-sm">{option.label}</span>
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

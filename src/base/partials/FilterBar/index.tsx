/**
 * FilterBar — filter trigger button + popover/sheet with available filters.
 *
 * Desktop (>=1024px): Popover. Tablet/Mobile: Sheet from bottom.
 *
 * @see NV-05-ux-blocks.md §1.2 toolbar anatomy
 */

import { useState, type ReactElement } from "react";
import { FilterIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { useTranslation } from "@/i18n/useTranslation";
import { Badge } from "@/primitives/reui/badge";
import { Button } from "@/primitives/reui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/primitives/reui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/primitives/reui/select";
import { Separator } from "@/primitives/reui/separator";

export interface FilterDef {
  key: string;
  label: string;
  type: "select" | "multiselect" | "date_range";
  options?: Array<{ value: string; label: string }>;
}

export interface AppliedFilters {
  [key: string]: string | string[];
}

export interface FilterBarProps {
  filters: FilterDef[];
  applied: AppliedFilters;
  onApply: (key: string, value: string | string[]) => void;
  onRemove: (key: string) => void;
  onClearAll: () => void;
  /** When true, chips are rendered externally (e.g. inline in DataTable toolbar). */
  hideChips?: boolean;
}

export function FilterBar({
  filters,
  applied,
  onApply,
  onRemove,
  onClearAll,
  hideChips = false,
}: FilterBarProps): ReactElement {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const appliedCount = Object.keys(applied).length;

  return (
    <div className={hideChips ? "" : "flex flex-col gap-2"}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {hideChips ? (
            <button
              className="text-muted-foreground hover:text-foreground hover:border-muted-foreground border-border inline-flex h-[30px] cursor-pointer items-center gap-1 rounded-[5px] border border-dashed px-2.5 text-xs font-medium transition-colors hover:border-solid"
              type="button"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                className="h-2.5 w-2.5"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              {t("middag.ui.filter.add")}
            </button>
          ) : (
            <Button variant="outline" size="sm" aria-expanded={open} className="gap-2">
              <HugeiconsIcon icon={FilterIcon} size={14} />
              {t("middag.ui.filter.button")}
              {appliedCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                  {appliedCount}
                </Badge>
              )}
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-72 space-y-4 p-4" align="start">
          <p className="text-sm font-semibold">{t("middag.ui.filter.title")}</p>
          {filters.map((filter) => (
            <div key={filter.key} className="space-y-1.5">
              <label className="text-muted-foreground text-xs font-medium">{filter.label}</label>
              {filter.type === "select" && filter.options && (
                <Select
                  value={(applied[filter.key] as string) ?? ""}
                  onValueChange={(val) => onApply(filter.key, val)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder={t("middag.ui.filter.placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {filter.options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
          <Separator />
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onClearAll();
                setOpen(false);
              }}
            >
              {t("middag.ui.filter.clear")}
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Applied filter chips (hidden when hideChips=true — rendered by parent) */}
      {!hideChips && appliedCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {Object.entries(applied).map(([key, value]) => {
            const filter = filters.find((f) => f.key === key);
            const displayValue = Array.isArray(value) ? value.join(", ") : value;
            return (
              <Badge key={key} variant="secondary" className="gap-1 pr-1">
                <span className="text-xs">
                  {filter?.label ?? key}: {displayValue}
                </span>
                <button
                  onClick={() => onRemove(key)}
                  className="hover:bg-muted-foreground/20 ml-1 rounded-sm p-0.5"
                  aria-label={`${t("middag.ui.filter.remove")} ${filter?.label ?? key}`}
                >
                  &times;
                </button>
              </Badge>
            );
          })}
          <button onClick={onClearAll} className="text-primary text-xs hover:underline">
            {t("middag.ui.filter.clear")}
          </button>
        </div>
      )}
    </div>
  );
}

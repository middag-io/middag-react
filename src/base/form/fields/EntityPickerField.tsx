/**
 * EntityPickerField — searchable entity selection with avatar support.
 *
 * Two modes:
 *   - Static: options provided directly, filtered locally
 *   - Async: fetches from autocompleteHref on input (debounced 300ms)
 *
 * Each item can display: avatar image, primary label, subtitle line.
 */

import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from "react";

import { useTranslation } from "@/i18n/useTranslation";
import { Avatar, AvatarFallback, AvatarImage } from "@/primitives/reui/avatar";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/primitives/reui/combobox";

export interface EntityOption {
  value: string;
  label: string;
  subtitle?: string;
  avatarUrl?: string;
}

export interface EntityPickerFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options?: EntityOption[];
  /** Pre-selected option so the current value renders before async search loads (edit mode). */
  initialOption?: EntityOption;
  autocompleteHref?: string;
  autocompleteMinChars?: number;
  entityAvatarField?: string;
  entitySubtitleField?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpTextId?: string;
  errorId?: string;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function EntityPickerField({
  id,
  value,
  onChange,
  options: staticOptions,
  initialOption,
  autocompleteHref,
  autocompleteMinChars = 2,
  entityAvatarField,
  entitySubtitleField,
  placeholder,
  disabled,
  required,
  error,
  helpTextId,
  errorId,
}: EntityPickerFieldProps): ReactElement {
  const { t } = useTranslation();
  // Seed the visible input from the preselected option so edit-mode renders the
  // current selection's label (the ComboboxInput shows the search text, which is
  // empty on load — without this the field looks unselected despite holding a value).
  const [searchQuery, setSearchQuery] = useState(
    initialOption && value && initialOption.value === value ? initialOption.label : "",
  );
  const [asyncOptions, setAsyncOptions] = useState<EntityOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const isAsync = !!autocompleteHref;

  const describedBy =
    [error ? errorId : undefined, helpTextId].filter(Boolean).join(" ") || undefined;

  // Stable empty array to avoid re-renders
  const emptyOptions = useMemo<EntityOption[]>(() => [], []);
  const safeStaticOptions = useMemo(
    () => staticOptions ?? emptyOptions,
    [staticOptions, emptyOptions],
  );

  // Async fetch with debounce — setState only inside the timeout callback (async),
  // never synchronously in the effect body.
  useEffect(() => {
    if (!isAsync) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (searchQuery.length < autocompleteMinChars) {
      // Clear via a microtask to avoid synchronous setState in the effect body
      debounceRef.current = setTimeout(() => setAsyncOptions([]), 0);
      return () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
      };
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const url = new URL(autocompleteHref!, window.location.origin);
        url.searchParams.set("q", searchQuery);
        const res = await fetch(url.toString());
        if (res.ok) {
          const json = await res.json();
          const items: EntityOption[] = (json.items ?? json.data ?? json).map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- server response
            (item: any) => ({
              value: String(item.value ?? item.id),
              label: String(item.label ?? item.name ?? item.title ?? ""),
              subtitle: entitySubtitleField ? String(item[entitySubtitleField] ?? "") : undefined,
              avatarUrl: entityAvatarField ? String(item[entityAvatarField] ?? "") : undefined,
            }),
          );
          setAsyncOptions(items);
        }
      } catch {
        // Silent — field remains usable
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [
    searchQuery,
    isAsync,
    autocompleteHref,
    autocompleteMinChars,
    entitySubtitleField,
    entityAvatarField,
  ]);

  const baseOptions = isAsync ? asyncOptions : safeStaticOptions;
  // Keep the currently-selected value renderable. In async mode the option list
  // is empty until the user searches, so an edit-mode preset value (an id with no
  // loaded label) renders blank. Splice the server-provided initialOption in until
  // live results include it.
  const options = useMemo<EntityOption[]>(() => {
    if (
      initialOption &&
      value &&
      initialOption.value === value &&
      !baseOptions.some((o) => o.value === value)
    ) {
      return [initialOption, ...baseOptions];
    }
    return baseOptions;
  }, [baseOptions, initialOption, value]);

  // Filter static options locally
  const filteredOptions = useMemo(() => {
    if (isAsync) return options;
    if (!searchQuery) return options;
    const q = searchQuery.toLowerCase();
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || o.subtitle?.toLowerCase().includes(q),
    );
  }, [options, searchQuery, isAsync]);

  const handleValueChange = useCallback(
    (val: string | null) => {
      onChange(val ?? "");
    },
    [onChange],
  );

  const emptyMessage = isLoading
    ? t("middag.ui.form.entity_loading")
    : searchQuery.length < autocompleteMinChars && isAsync
      ? t("middag.ui.form.entity_min_chars").replace("{min}", String(autocompleteMinChars))
      : t("middag.ui.form.entity_no_results");

  const showAvatars = !!entityAvatarField || options.some((o) => o.avatarUrl);

  return (
    <Combobox items={filteredOptions} value={value || null} onValueChange={handleValueChange}>
      <ComboboxInput
        id={id}
        placeholder={placeholder ?? t("middag.ui.form.entity_search")}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy}
        showClear={!!value}
        showTrigger
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <ComboboxContent>
        <ComboboxEmpty className="px-4 py-3 text-sm">{emptyMessage}</ComboboxEmpty>
        <ComboboxList>
          {filteredOptions.map((option) => (
            <ComboboxItem
              key={option.value}
              value={option.value}
              className="flex items-center gap-2.5 px-3 py-2"
            >
              {showAvatars && (
                <Avatar className="h-7 w-7 shrink-0">
                  {option.avatarUrl && <AvatarImage src={option.avatarUrl} alt={option.label} />}
                  <AvatarFallback className="text-[10px]">
                    {getInitials(option.label)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm">{option.label}</div>
                {option.subtitle && (
                  <div className="text-muted-foreground truncate text-xs">{option.subtitle}</div>
                )}
              </div>
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

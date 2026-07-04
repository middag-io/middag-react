/**
 * TagsField -- chip-based tag input with keyboard support.
 *
 * Enter or comma adds a tag. Backspace removes the last tag.
 * Tags are stored as string array.
 */

import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
} from "react";

import { useTranslation } from "@/i18n/useTranslation";

export interface TagsFieldProps {
  id: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpTextId?: string;
  errorId?: string;
  maxTags?: number;
}

export function TagsField({
  id,
  value,
  onChange,
  placeholder,
  disabled,
  required,
  error,
  helpTextId,
  errorId,
  maxTags,
}: TagsFieldProps): ReactElement {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const tags = useMemo(() => value ?? [], [value]);

  const describedBy =
    [error ? errorId : undefined, helpTextId].filter(Boolean).join(" ") || undefined;

  const addTag = useCallback(
    (tag: string) => {
      const trimmed = tag.trim();
      if (!trimmed) return;
      if (tags.includes(trimmed)) return;
      if (maxTags && tags.length >= maxTags) return;
      onChange([...tags, trimmed]);
      setInput("");
    },
    [tags, onChange, maxTags],
  );

  const removeTag = useCallback(
    (idx: number) => {
      onChange(tags.filter((_, i) => i !== idx));
    },
    [tags, onChange],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        addTag(input);
      } else if (e.key === "Backspace" && !input && tags.length > 0) {
        removeTag(tags.length - 1);
      }
    },
    [input, tags, addTag, removeTag],
  );

  return (
    <div
      className={`focus-within:ring-ring flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border px-2 py-1.5 text-sm transition-colors focus-within:ring-1 ${
        error ? "border-destructive" : "border-input"
      } ${disabled ? "opacity-50" : ""}`}
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag, idx) => (
        <span
          key={`${tag}-${idx}`}
          className="bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium"
        >
          {tag}
          {!disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(idx);
              }}
              className="text-muted-foreground hover:text-foreground ml-0.5"
              aria-label={`${t("middag.ui.form.tags_remove")} ${tag}`}
            >
              &times;
            </button>
          )}
        </span>
      ))}
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => addTag(input)}
        placeholder={tags.length === 0 ? (placeholder ?? t("middag.ui.form.tags_placeholder")) : ""}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy}
        className="placeholder:text-muted-foreground min-w-[80px] flex-1 bg-transparent outline-none"
      />
    </div>
  );
}

/**
 * FileUploadField — drag-drop file upload with previews and error handling.
 *
 * Uses the useFileUpload hook for drag-drop, file validation, and previews.
 */

import { useState, type ReactElement } from "react";
import { Cancel01Icon, FileEmpty02Icon, Upload01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/reui/button";
import type { FileValue } from "@/contracts/generated";
import { useTranslation } from "@/i18n/useTranslation";
import {
  formatBytes,
  useFileUpload,
  type FileMetadata,
  type FileWithPreview,
} from "@/lib/hooks/use-file-upload";
import { cn } from "@/lib/utils";

export interface FileUploadFieldProps {
  id: string;
  value: unknown;
  onChange: (value: File[] | File | null) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpTextId?: string;
  errorId?: string;
}

/** Server-provided shape for an already-uploaded file (edit mode). */
// The object form of a wire file value (the bare-URL string shorthand is
// handled separately). Derived from the generated FileValue contract so the
// field's parser tracks the PHP source of truth (closes F-23).
type ExistingFileValue = Exclude<FileValue, string>;

/** Derive a display name from a URL (strips query/hash and directories). */
function fileNameFromUrl(url: string): string {
  const clean = url.split(/[?#]/)[0];
  const segments = clean.split("/");
  return segments[segments.length - 1] || clean;
}

/**
 * Normalize a single controlled value entry into FileMetadata.
 * Accepts a URL string or an object with url/name. Real `File` instances and
 * unrecognized shapes return null — those are new uploads managed by the hook,
 * not pre-existing server files.
 */
function toFileMetadata(entry: unknown): FileMetadata | null {
  if (entry == null || entry === "") return null;

  if (typeof entry === "string") {
    const name = fileNameFromUrl(entry);
    return { name, size: 0, type: "", url: entry, id: entry };
  }

  if (typeof entry === "object" && !(entry instanceof File)) {
    const v = entry as ExistingFileValue;
    const url = typeof v.url === "string" ? v.url : "";
    const name = typeof v.name === "string" ? v.name : url ? fileNameFromUrl(url) : "";
    if (!url && !name) return null;
    return {
      name,
      size: typeof v.size === "number" ? v.size : 0,
      type: typeof v.type === "string" ? v.type : "",
      url,
      id: typeof v.id === "string" && v.id ? v.id : url || name,
    };
  }

  return null;
}

/** Normalize the controlled value into the FileMetadata[] the hook seeds at mount. */
function normalizeInitialFiles(value: unknown): FileMetadata[] {
  const entries = Array.isArray(value) ? value : [value];
  return entries.map(toFileMetadata).filter((f): f is FileMetadata => f !== null);
}

export function FileUploadField({
  id,
  value,
  onChange,
  accept = "*",
  multiple = false,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024,
  disabled,
  required,
  error,
  helpTextId,
  errorId,
}: FileUploadFieldProps): ReactElement {
  const { t } = useTranslation();

  // Seed existing (server-provided) files once at mount — the hook reads
  // initialFiles only in its state initializer. This mirrors edit-mode
  // semantics: an untouched existing file stays in the RHF value (it is never
  // re-uploaded because FileMetadata is filtered out of onChange below), a
  // removal fires onChange, and a new upload replaces/adds as before.
  const [initialFiles] = useState<FileMetadata[]>(() => normalizeInitialFiles(value));

  const [
    { files, isDragging, errors: uploadErrors },
    {
      removeFile,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles: multiple ? maxFiles : 1,
    maxSize,
    accept,
    multiple,
    initialFiles,
    onFilesChange: (items: FileWithPreview[]) => {
      const rawFiles = items.map((f) => f.file).filter((f): f is File => f instanceof File);
      if (multiple) {
        onChange(rawFiles);
      } else {
        onChange(rawFiles[0] ?? null);
      }
    },
  });

  const describedBy =
    [error ? errorId : undefined, helpTextId].filter(Boolean).join(" ") || undefined;

  const isImage = (file: File | { type: string }) => file.type.startsWith("image/");

  return (
    <div>
      {/* Drop zone */}
      <div
        className={cn(
          "rounded-lg border border-dashed p-4 transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          disabled && "pointer-events-none opacity-50",
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          {...getInputProps()}
          id={id}
          className="sr-only"
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-required={required || undefined}
          aria-describedby={describedBy}
        />

        {files.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center gap-2 py-4">
            <HugeiconsIcon
              icon={Upload01Icon}
              className={cn("size-8", isDragging ? "text-primary" : "text-muted-foreground")}
            />
            <p className="text-muted-foreground text-sm">{t("middag.ui.form.file_drop_hint")}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openFileDialog}
              disabled={disabled}
            >
              {t("middag.ui.form.file_browse")}
            </Button>
            <p className="text-muted-foreground text-xs">
              {t("middag.ui.form.file_max_size")} {formatBytes(maxSize)}
            </p>
          </div>
        ) : (
          /* File list */
          <div className="space-y-2">
            {files.map((fileItem) => (
              <div
                key={fileItem.id}
                className="bg-muted/50 flex items-center gap-3 rounded-md px-3 py-2"
              >
                {isImage(fileItem.file) && fileItem.preview ? (
                  <img
                    src={fileItem.preview}
                    alt={fileItem.file.name}
                    className="size-10 shrink-0 rounded border object-cover"
                  />
                ) : (
                  <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded border">
                    <HugeiconsIcon
                      icon={FileEmpty02Icon}
                      className="text-muted-foreground size-5"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{fileItem.file.name}</p>
                  <p className="text-muted-foreground text-xs">{formatBytes(fileItem.file.size)}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => removeFile(fileItem.id)}
                  disabled={disabled}
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
                </Button>
              </div>
            ))}
            {multiple && files.length < maxFiles && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openFileDialog}
                disabled={disabled}
              >
                {t("middag.ui.form.file_add_more")}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Upload errors */}
      {uploadErrors.length > 0 && (
        <div className="mt-1.5 space-y-0.5">
          {uploadErrors.map((err, i) => (
            <p key={i} className="text-destructive text-xs">
              {err}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

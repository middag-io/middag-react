/**
 * LogViewerToolbar — filename, line count, raw/parsed toggle, download, copy, close.
 */

import type { ReactElement } from "react";
import { Cancel01Icon, Copy01Icon, Download01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { toast } from "sonner";

import { useTranslation } from "@/i18n/useTranslation";
import { Badge } from "@/primitives/reui/badge";
import { Button } from "@/primitives/reui/button";

interface LogViewerToolbarProps {
  filename: string;
  totalLines: number;
  downloadUrl: string;
  rawMode: boolean;
  onToggleRaw: () => void;
  rawContent: string;
  onClose?: () => void;
}

export function LogViewerToolbar({
  filename,
  totalLines,
  downloadUrl,
  rawMode,
  onToggleRaw,
  rawContent,
  onClose,
}: LogViewerToolbarProps): ReactElement {
  const { t } = useTranslation();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawContent);
      toast.success(t("middag.ui.log.copied"));
    } catch {
      toast.error(t("middag.ui.log.copy_failed"));
    }
  };

  return (
    <div className="border-border flex items-center gap-2 border-b px-3 py-2">
      <code className="text-sm font-medium">{filename}</code>
      <Badge variant="secondary" size="xs">
        {totalLines} {t("middag.ui.log.lines")}
      </Badge>

      <div className="flex-1" />

      <Button variant="ghost" size="xs" onClick={onToggleRaw}>
        {rawMode ? t("middag.ui.log.parsed") : t("middag.ui.log.raw")}
      </Button>
      <Button variant="ghost" size="icon-xs" onClick={handleCopy} title={t("middag.ui.log.copy")}>
        <HugeiconsIcon icon={Copy01Icon as unknown as IconSvgElement} className="size-3.5" />
      </Button>
      <Button variant="ghost" size="icon-xs" asChild title={t("middag.ui.log.download")}>
        <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
          <HugeiconsIcon icon={Download01Icon as unknown as IconSvgElement} className="size-3.5" />
        </a>
      </Button>
      {onClose && (
        <Button variant="ghost" size="icon-xs" onClick={onClose} title={t("middag.ui.close")}>
          <HugeiconsIcon icon={Cancel01Icon as unknown as IconSvgElement} className="size-3.5" />
        </Button>
      )}
    </div>
  );
}

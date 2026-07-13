/**
 * DetailSection — section-based detail view with key-value fields.
 *
 * Renders structured data as label/value pairs in a responsive grid.
 * Desktop uses CSS grid (1fr/2fr), mobile stacks with overline labels.
 * Supports multiple field kinds: text, status, timestamp, boolean, link, code, email.
 *
 * @see NV-05-ux-blocks.md §4 (detail section anatomy)
 */

import { useCallback, useState, type ReactElement } from "react";
import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  CheckmarkSquare01Icon,
  Copy01Icon,
  Globe02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { copyToClipboard } from "@/base/utils/clipboard";
import { formatISO, formatRelativeTime } from "@/base/utils/time";
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/lib/utils";
import { Badge } from "@/primitives/reui/badge";
import { Button } from "@/primitives/reui/button";
import { Frame, FrameHeader, FramePanel, FrameTitle } from "@/primitives/reui/frame";
import { Skeleton } from "@/primitives/reui/skeleton";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

export type FieldKind = "text" | "status" | "timestamp" | "boolean" | "link" | "code" | "email";

export interface DetailField {
  key: string;
  label: string;
  value: string | number | boolean | null;
  kind?: FieldKind;
  copyable?: boolean;
  href?: string;
}

export interface SectionAction {
  id: string;
  label: string;
  onClick: () => void;
}

export interface DetailSectionSection {
  id: string;
  title: string;
  fields: DetailField[];
  defaultCollapsed?: boolean;
  actions?: SectionAction[];
}

export interface DetailSectionProps {
  sections: DetailSectionSection[];
  isLoading?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Status badge mapping                                              */
/* ------------------------------------------------------------------ */

const STATUS_BADGE_VARIANT: Record<string, string> = {
  active: "success-light",
  connected: "success-light",
  healthy: "success-light",
  success: "success-light",
  warning: "warning-light",
  degraded: "warning-light",
  pending: "warning-light",
  error: "destructive-light",
  failed: "destructive-light",
  disconnected: "destructive-light",
  inactive: "outline",
  unknown: "outline",
};

function resolveBadgeVariant(status: string): string {
  return STATUS_BADGE_VARIANT[status.toLowerCase()] ?? "outline";
}

/* ------------------------------------------------------------------ */
/*  CopyButton                                                        */
/* ------------------------------------------------------------------ */

function CopyButton({ text }: { text: string }): ReactElement {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="ml-2 inline-flex shrink-0 opacity-0 transition-opacity group-hover/field:opacity-100 focus:opacity-100"
      aria-label={t("middag.ui.detail_section.copy_value")}
    >
      <HugeiconsIcon
        icon={copied ? CheckmarkSquare01Icon : Copy01Icon}
        size={14}
        className={cn(
          "transition-colors",
          copied ? "text-success" : "text-muted-foreground hover:text-foreground",
        )}
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  FieldValue                                                        */
/* ------------------------------------------------------------------ */

function FieldValue({ field }: { field: DetailField }): ReactElement {
  const { t, locale } = useTranslation();
  const { value, kind = "text", href } = field;

  // Null / undefined
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">&mdash;</span>;
  }

  switch (kind) {
    case "status": {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Badge variant resolved dynamically
      const variant = resolveBadgeVariant(String(value)) as any;
      return (
        <Badge variant={variant} size="sm">
          {String(value)}
        </Badge>
      );
    }

    case "timestamp": {
      const ts = typeof value === "number" ? value : Number(value);
      return (
        <time dateTime={formatISO(ts)} title={formatISO(ts)} className="text-sm">
          {formatRelativeTime(ts, locale)}
        </time>
      );
    }

    case "boolean":
      return (
        <HugeiconsIcon
          icon={value ? CheckmarkCircle01Icon : Cancel01Icon}
          size={16}
          className={value ? "text-success" : "text-muted-foreground"}
          aria-label={value ? t("middag.ui.common.yes") : t("middag.ui.common.no")}
        />
      );

    case "link":
      return (
        <a
          href={href ?? String(value)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary inline-flex items-center gap-1 text-sm hover:underline"
        >
          {String(value)}
          <HugeiconsIcon icon={Globe02Icon} size={12} aria-hidden="true" />
        </a>
      );

    case "code":
      return (
        <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">{String(value)}</code>
      );

    case "email":
      return (
        <a href={`mailto:${String(value)}`} className="text-primary text-sm hover:underline">
          {String(value)}
        </a>
      );

    default:
      return <span className="text-sm">{String(value)}</span>;
  }
}

/* ------------------------------------------------------------------ */
/*  Section (collapsible)                                             */
/* ------------------------------------------------------------------ */

function Section({ section }: { section: DetailSectionSection }): ReactElement {
  const [collapsed, setCollapsed] = useState(section.defaultCollapsed ?? false);
  const expanded = !collapsed;
  const contentId = `detail-section-${section.id}-content`;

  return (
    <Frame variant="default" spacing="sm">
      <FrameHeader>
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            aria-expanded={expanded}
            aria-controls={contentId}
            className="-ml-2 flex items-center gap-2 px-2"
          >
            <HugeiconsIcon
              icon={expanded ? ArrowDown01Icon : ArrowRight01Icon}
              size={14}
              aria-hidden="true"
            />
            <FrameTitle className="text-base">{section.title}</FrameTitle>
          </Button>

          {section.actions && section.actions.length > 0 && (
            <div className="flex items-center gap-2">
              {section.actions.map((action) => (
                <Button key={action.id} variant="outline" size="xs" onClick={action.onClick}>
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </FrameHeader>

      <FramePanel
        className={cn(
          "transition-[opacity,height] duration-200 ease-[var(--ease-default)]",
          expanded ? "opacity-100" : "hidden opacity-0",
        )}
      >
        <div id={contentId}>
          <dl className="space-y-0">
            {section.fields.map((field) => (
              <div
                key={field.key}
                className="group/field border-border/50 grid grid-cols-1 gap-1 border-b py-3 last:border-b-0 md:grid-cols-[1fr_2fr] md:items-center md:gap-4"
              >
                {/* Label */}
                <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase md:text-sm md:tracking-normal md:normal-case">
                  {field.label}
                </dt>

                {/* Value */}
                <dd className="flex items-center">
                  <FieldValue field={field} />
                  {field.copyable && field.value !== null && field.value !== undefined && (
                    <CopyButton text={String(field.value)} />
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </FramePanel>
    </Frame>
  );
}

/* ------------------------------------------------------------------ */
/*  Skeleton                                                          */
/* ------------------------------------------------------------------ */

function DetailSectionSkeleton(): ReactElement {
  return (
    <div className="space-y-6">
      {[1, 2].map((s) => (
        <Frame key={s} variant="default" spacing="sm">
          <FrameHeader>
            <Skeleton className="h-5 w-36" />
          </FrameHeader>
          <FramePanel>
            <div className="space-y-4">
              {[1, 2, 3].map((f) => (
                <div key={f} className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_2fr]">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-48" />
                </div>
              ))}
            </div>
          </FramePanel>
        </Frame>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export function DetailSection({ sections, isLoading }: DetailSectionProps): ReactElement {
  if (isLoading) {
    return <DetailSectionSkeleton />;
  }

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <Section key={section.id} section={section} />
      ))}
    </div>
  );
}

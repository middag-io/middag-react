/**
 * FormSection — collapsible fieldset container for form groups.
 *
 * Does not render fields — receives them as children.
 *
 * @see NV-05-ux-blocks.md §2.6
 */

import { useState, type ReactElement, type ReactNode } from "react";
import { ArrowDown01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/reui/button";
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/lib/utils";

export interface FormSectionProps {
  id: string;
  title?: string;
  description?: string;
  children: ReactNode;
  defaultCollapsed?: boolean;
  hasErrors?: boolean;
  errorCount?: number;
}

export function FormSection({
  id,
  title,
  description,
  children,
  defaultCollapsed = false,
  hasErrors = false,
  errorCount,
}: FormSectionProps): ReactElement {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(defaultCollapsed && !hasErrors);
  const contentId = `${id}-content`;
  const isCollapsible = !!title;
  const expanded = !collapsed || hasErrors;

  return (
    <fieldset className="border-border space-y-5 rounded-lg border p-6">
      {title && <legend className="sr-only">{title}</legend>}

      {title && (
        <div className="-mt-2 flex items-center justify-between">
          {isCollapsible ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => !hasErrors && setCollapsed(!collapsed)}
              aria-expanded={expanded}
              aria-controls={contentId}
              className="-ml-2 flex items-center gap-2 px-2"
              disabled={hasErrors}
            >
              <HugeiconsIcon icon={expanded ? ArrowDown01Icon : ArrowRight01Icon} size={14} />
              <span className="text-foreground text-lg font-semibold">{title}</span>
            </Button>
          ) : (
            <h3 className="text-foreground text-lg font-semibold">{title}</h3>
          )}

          {hasErrors && errorCount !== undefined && errorCount > 0 && (
            <span className="text-destructive text-xs">
              ({t("middag.ui.form.error", { count: errorCount })})
            </span>
          )}
        </div>
      )}

      {description && expanded && <p className="text-muted-foreground text-xs">{description}</p>}

      <div
        id={contentId}
        className={cn(
          "space-y-5 transition-[opacity,height] duration-200 ease-[var(--ease-default)]",
          expanded ? "opacity-100" : "hidden opacity-0",
        )}
      >
        {children}
      </div>
    </fieldset>
  );
}

/**
 * DetailPanelBlock — sectioned key-value detail panel.
 *
 * Delegates to DetailSection partial (created by partials-builder agent).
 * Stub implementation until DetailSection is available — renders fields directly.
 *
 * @see NV-05-ux-blocks.md §4
 */

import { useCallback, useState, type ReactElement } from "react";
import { CheckmarkCircle01Icon, Copy01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router } from "@inertiajs/core";
import type { TFunction } from "i18next";

import { ConfirmationDialog } from "@/base/partials/ConfirmationDialog";
import { getIcon } from "@/base/utils/icons";
import type {
  DetailPanelBlockData,
  DetailPanelFieldDef,
  ExecutableAction,
} from "@/contracts/block-data";
import { EntityLink } from "@/engine/EntityRoutes";
import type { BlockProps } from "@/engine/registries";
import { renderLabel } from "@/i18n/render-label";
import { useTranslation } from "@/i18n/useTranslation";
import { resolveActionTarget } from "@/lib/actions/resolve-action-target";
import { Button } from "@/primitives/reui/button";
import { Skeleton } from "@/primitives/reui/skeleton";

export function DetailPanelBlock({ block }: BlockProps<DetailPanelBlockData>): ReactElement {
  const { t } = useTranslation();
  const { data, meta } = block;
  const isLoading = meta?.loading === true;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-5 w-32" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="grid grid-cols-[1fr_2fr] gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-40" />
          </div>
        ))}
      </div>
    );
  }

  const copyableText = meta?.copyableText as string | undefined;

  return (
    <div className="space-y-8">
      {copyableText && <CopyReportButton text={copyableText} />}
      {data.sections.map((section) => (
        <section key={section.id} role="region" aria-label={renderLabel(section.title, t)}>
          <div className="mb-4 flex items-center justify-between">
            <h3 id={`${section.id}-heading`} className="text-foreground text-lg font-semibold">
              {renderLabel(section.title, t)}
            </h3>
            {section.actions && section.actions.length > 0 && (
              <div className="flex gap-2">
                {section.actions.map((action) => (
                  <SectionActionButton key={action.id} action={action} />
                ))}
              </div>
            )}
          </div>
          <dl className="grid gap-3 md:grid-cols-[1fr_2fr]">
            {section.fields.map((field) => (
              <div key={field.key} className="contents">
                <dt className="text-muted-foreground text-sm md:text-right">
                  {renderLabel(field.label, t)}
                </dt>
                <dd className="text-foreground text-sm">
                  <FieldValue field={field} t={t} />
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

function SectionActionButton({ action }: { action: ExecutableAction }): ReactElement {
  const { t } = useTranslation();
  const [showConfirm, setShowConfirm] = useState(false);
  const Icon = action.icon ? getIcon(action.icon) : undefined;

  const executeAction = useCallback(() => {
    const target = resolveActionTarget(action);
    if (target.kind === "link") {
      router.visit(target.url);
    } else if (target.method === "delete") {
      router.delete(target.url, { preserveState: true });
    } else {
      const method = target.method as "post" | "put" | "patch";
      router[method](target.url, {} as never, { preserveState: true });
    }
  }, [action]);

  const handleClick = useCallback(() => {
    if (action.confirmation) {
      setShowConfirm(true);
    } else {
      executeAction();
    }
  }, [action.confirmation, executeAction]);

  const confirmation = action.confirmation;

  return (
    <>
      <Button
        variant={action.intent === "danger" ? "destructive" : "outline"}
        size="sm"
        onClick={handleClick}
        disabled={action.disabled}
      >
        {Icon && <HugeiconsIcon icon={Icon} size={14} className="mr-1.5" />}
        {renderLabel(action.label, t)}
      </Button>
      {confirmation && (
        <ConfirmationDialog
          open={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={() => {
            executeAction();
            setShowConfirm(false);
          }}
          title={renderLabel(confirmation.title, t)}
          message={renderLabel(confirmation.message, t)}
          intent={confirmation.intent}
          confirmLabel={
            confirmation.confirmLabel ? renderLabel(confirmation.confirmLabel, t) : undefined
          }
          cancelLabel={
            confirmation.cancelLabel ? renderLabel(confirmation.cancelLabel, t) : undefined
          }
        />
      )}
    </>
  );
}

function FieldValue({ field, t }: { field: DetailPanelFieldDef; t: TFunction }): ReactElement {
  if (field.value === null || field.value === undefined) {
    return <span className="text-muted-foreground">&mdash;</span>;
  }
  if (typeof field.value === "boolean") {
    return <>{field.value ? t("middag.ui.common.yes") : t("middag.ui.common.no")}</>;
  }
  const text = String(field.value);
  // Entity link resolution
  if (field.entity) {
    return (
      <EntityLink type={field.entity.type} id={field.entity.id}>
        {text}
      </EntityLink>
    );
  }
  return <>{text}</>;
}

function CopyReportButton({ text }: { text: string }): ReactElement {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may fail in insecure contexts.
    }
  }

  return (
    <div className="flex justify-end">
      <Button variant="outline" size="sm" onClick={handleCopy}>
        <HugeiconsIcon icon={copied ? CheckmarkCircle01Icon : Copy01Icon} size={14} />
        {copied ? t("middag.ui.detail_panel.copied") : t("middag.ui.detail_panel.copy_report")}
      </Button>
    </div>
  );
}

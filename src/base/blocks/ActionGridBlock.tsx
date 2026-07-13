/**
 * ActionGridBlock — grid of action cards with confirmation dialog.
 *
 * Each card displays an icon, title, description, and an action button.
 * When confirmText is present, an AlertDialog gates the action.
 * Actions execute via Inertia router.post/delete.
 *
 * @see ADR-807
 */

"use client";

import { useCallback, useState, type ReactElement } from "react";
import { AlertCircleIcon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { router } from "@inertiajs/core";

import { ConfirmationDialog } from "@/base/partials/ConfirmationDialog";
import { getIcon } from "@/base/utils/icons";
import type { ActionGridBlockData } from "@/contracts/block-data";
import type { BlockProps } from "@/engine/registries";
import { renderLabel } from "@/i18n/render-label";
import { useTranslation } from "@/i18n/useTranslation";
import { resolveActionTarget } from "@/lib/actions/resolve-action-target";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/primitives/reui/alert";
import { Badge } from "@/primitives/reui/badge";
import { Button } from "@/primitives/reui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/primitives/reui/card";

export function ActionGridBlock({ block }: BlockProps<ActionGridBlockData>): ReactElement {
  const { t } = useTranslation();
  const { data } = block;
  // Tie dismissal to the specific flash, so a new server message re-shows the
  // alert instead of staying suppressed after a previous dismissal.
  const flashKey = data.flash ? `${data.flash.success}:${data.flash.message}` : null;
  const [dismissedKey, setDismissedKey] = useState<string | null>(null);
  const isDismissed = dismissedKey !== null && dismissedKey === flashKey;

  return (
    <div className="space-y-6">
      {data.flash && !isDismissed && (
        <Alert variant={data.flash.success ? "success" : "destructive"}>
          <HugeiconsIcon
            icon={data.flash.success ? CheckmarkCircle01Icon : AlertCircleIcon}
            size={16}
          />
          <AlertTitle>
            {data.flash.success
              ? t("middag.ui.action_grid.success")
              : t("middag.ui.action_grid.error")}
          </AlertTitle>
          <AlertDescription>{data.flash.message}</AlertDescription>
          <AlertAction>
            <Button variant="ghost" size="xs" onClick={() => setDismissedKey(flashKey)}>
              {t("middag.ui.dismiss")}
            </Button>
          </AlertAction>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((item) => (
          <ActionCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function ActionCard({ item }: { item: ActionGridBlockData["items"][number] }): ReactElement {
  const { t } = useTranslation();
  const Icon = getIcon(item.icon ?? "");
  const [showConfirm, setShowConfirm] = useState(false);

  const executeAction = useCallback(() => {
    const target = resolveActionTarget(item);
    if (target.kind === "link") {
      router.visit(target.url);
    } else if (target.method === "delete") {
      router.delete(target.url);
    } else {
      const method = target.method as "post" | "put" | "patch";
      router[method](target.url);
    }
  }, [item]);

  const handleClick = useCallback(() => {
    if (item.confirmation) {
      setShowConfirm(true);
    } else {
      executeAction();
    }
  }, [item.confirmation, executeAction]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <Badge variant="secondary" size="xl" radius="full" className="shrink-0">
            <HugeiconsIcon icon={Icon} size={16} />
          </Badge>
          <div className="min-w-0">
            <CardTitle className="text-sm">{item.title}</CardTitle>
            <CardDescription className="mt-1">{item.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button variant="outline" size="sm" className="w-full" onClick={handleClick}>
          {renderLabel(item.label, t)}
        </Button>
        {item.confirmation && (
          <ConfirmationDialog
            open={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={() => {
              executeAction();
              setShowConfirm(false);
            }}
            title={renderLabel(item.confirmation.title, t)}
            message={renderLabel(item.confirmation.message, t)}
            intent={item.confirmation.intent}
            confirmLabel={
              item.confirmation.confirmLabel
                ? renderLabel(item.confirmation.confirmLabel, t)
                : undefined
            }
            cancelLabel={
              item.confirmation.cancelLabel
                ? renderLabel(item.confirmation.cancelLabel, t)
                : undefined
            }
          />
        )}
      </CardContent>
    </Card>
  );
}

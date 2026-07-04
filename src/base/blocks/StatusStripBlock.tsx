/**
 * StatusStripBlock — horizontal status indicators strip.
 *
 * Delegates to StatusBar partial. Derives score item if score is present.
 *
 * @see NV-05-ux-blocks.md §5
 */

import type { ReactElement } from "react";

import type { BlockProps } from "@/app/registries";
import { StatusBar, type StatusBarItem } from "@/base/partials/StatusBar";
import type { StatusItemAppearance, StatusStripBlockData } from "@/contracts/block-data";
import { useTranslation } from "@/i18n/useTranslation";

function scoreToAppearance(score: number): StatusItemAppearance {
  if (score >= 80) return "success";
  if (score >= 60) return "warning";
  return "danger";
}

export function StatusStripBlock({ block }: BlockProps<StatusStripBlockData>): ReactElement | null {
  const { t } = useTranslation();
  const { data, meta } = block;
  const isLoading = meta?.loading === true;

  const items: StatusBarItem[] = [];

  if (data.score !== undefined) {
    items.push({
      key: "__score",
      label: t("middag.ui.status.score"),
      value: `${data.score}%`,
      appearance: scoreToAppearance(data.score),
    });
  }

  items.push(...data.items);

  if (items.length === 0 && !isLoading) return null;

  return <StatusBar items={items} isLoading={isLoading} />;
}

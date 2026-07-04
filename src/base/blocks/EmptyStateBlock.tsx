/**
 * EmptyStateBlock — variant-aware empty state with icon, description, and CTA.
 *
 * Delegates to EmptyPlaceholder partial.
 *
 * @see NV-05-ux-blocks.md §7
 */

import type { ReactElement } from "react";
import { router } from "@inertiajs/core";

import type { BlockProps } from "@/app/registries";
import { EmptyPlaceholder } from "@/base/partials/EmptyPlaceholder";
import type { EmptyStateBlockData } from "@/contracts/block-data";
import { renderLabel } from "@/i18n/render-label";
import { useTranslation } from "@/i18n/useTranslation";

export function EmptyStateBlock({ block }: BlockProps<EmptyStateBlockData>): ReactElement {
  const { t } = useTranslation();
  const { data, title } = block;

  return (
    <div role="status">
      <EmptyPlaceholder
        variant={data.variant}
        icon={data.icon}
        lottieUrl={data.lottieUrl}
        title={renderLabel(title ?? data.variant ?? t("middag.ui.empty_state.default_title"), t)}
        description={data.description}
        cta={
          data.cta
            ? {
                label: data.cta.label,
                href: data.cta.method === "post" ? undefined : data.cta.href,
                onClick:
                  data.cta.method === "post" && data.cta.href
                    ? () => router.post(data.cta!.href!)
                    : undefined,
              }
            : undefined
        }
        ctaSecondary={data.ctaSecondary}
      />
    </div>
  );
}

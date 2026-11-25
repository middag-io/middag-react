/**
 * EmptyStateBlock — variant-aware empty state with icon, description, and CTA.
 *
 * Delegates to EmptyPlaceholder partial.
 */

import type { ReactElement } from "react";
import { router } from "@inertiajs/core";

import { EmptyPlaceholder } from "@/base/partials/EmptyPlaceholder";
import { knownValue } from "@/base/utils/php-wire";
import type { EmptyStateBlockData } from "@/contracts/block-data";
import type { BlockProps } from "@/engine/registries";
import { renderLabel } from "@/i18n/render-label";
import { useTranslation } from "@/i18n/useTranslation";

/** Empty-state variants the placeholder draws; any other value gets the default look. */
const EMPTY_STATE_VARIANTS = ["first-use", "no-results", "error", "permission"] as const;

export function EmptyStateBlock({ block }: BlockProps<EmptyStateBlockData>): ReactElement {
  const { t } = useTranslation();
  const { data, title } = block;

  return (
    <div role="status">
      <EmptyPlaceholder
        variant={knownValue(data.variant, EMPTY_STATE_VARIANTS)}
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

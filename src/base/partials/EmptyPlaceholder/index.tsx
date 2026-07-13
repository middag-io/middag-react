/**
 * EmptyPlaceholder — contextual empty state with icon, title, description, and CTA.
 *
 * Variants: first-use, no-results, error, permission, compact, inline.
 *
 * @see NV-05-ux-blocks.md §7.1–7.8, §9.3
 */

import { lazy, Suspense, type ReactElement } from "react";
import { Cancel01Icon, InboxIcon, LockIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@inertiajs/react";

import { getIcon } from "@/base/utils/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/primitives/reui/button";

const DotLottieReact = lazy(() =>
  import("@lottiefiles/dotlottie-react").then((m) => ({
    default: m.DotLottieReact,
  })),
);

export type EmptyPlaceholderVariant =
  | "first-use"
  | "no-results"
  | "error"
  | "permission"
  | "compact"
  | "inline";

export interface EmptyPlaceholderCTA {
  label: string;
  href?: string;
  onClick?: () => void;
  intent?: "primary" | "secondary";
  isLoading?: boolean;
}

export interface EmptyPlaceholderProps {
  variant?: EmptyPlaceholderVariant;
  icon?: string;
  /** Lottie JSON animation URL. Replaces the icon when provided. */
  lottieUrl?: string;
  title: string;
  description?: string;
  cta?: EmptyPlaceholderCTA;
  ctaSecondary?: { label: string; href: string };
}

const VARIANT_CONFIG: Record<
  EmptyPlaceholderVariant,
  { iconSize: number; padding: string; maxDescWidth: string }
> = {
  "first-use": {
    iconSize: 56,
    padding: "py-20",
    maxDescWidth: "max-w-[380px]",
  },
  "no-results": {
    iconSize: 32,
    padding: "py-12",
    maxDescWidth: "max-w-[360px]",
  },
  error: { iconSize: 48, padding: "py-16", maxDescWidth: "max-w-[400px]" },
  permission: { iconSize: 48, padding: "py-16", maxDescWidth: "max-w-[400px]" },
  compact: { iconSize: 48, padding: "py-10", maxDescWidth: "max-w-[360px]" },
  inline: { iconSize: 32, padding: "py-6", maxDescWidth: "max-w-[320px]" },
};

function resolveIcon(variant: EmptyPlaceholderVariant, iconName?: string) {
  if (variant === "error") return Cancel01Icon;
  if (variant === "permission") return LockIcon;
  if (iconName) return getIcon(iconName);
  return InboxIcon;
}

function resolveIconColor(variant: EmptyPlaceholderVariant): string {
  if (variant === "error") return "text-destructive";
  return "text-muted-foreground/50";
}

export function EmptyPlaceholder({
  variant = "first-use",
  icon,
  lottieUrl,
  title,
  description,
  cta,
  ctaSecondary,
}: EmptyPlaceholderProps): ReactElement {
  const config = VARIANT_CONFIG[variant];
  const iconData = resolveIcon(variant, icon);
  const iconColor = resolveIconColor(variant);
  const showCTA = variant !== "permission" && cta;
  const lottieSize = config.iconSize * 1.8;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-col items-center text-center", config.padding)}
    >
      {lottieUrl ? (
        <Suspense
          fallback={<div style={{ width: lottieSize, height: lottieSize }} className="mb-4" />}
        >
          <DotLottieReact
            src={lottieUrl}
            loop
            autoplay
            style={{ width: lottieSize, height: lottieSize }}
            className="mb-4"
          />
        </Suspense>
      ) : (
        <HugeiconsIcon
          icon={iconData}
          size={config.iconSize}
          className={cn(iconColor, "mb-4")}
          aria-hidden="true"
        />
      )}

      <h3 className="text-foreground text-base font-semibold">{title}</h3>

      {description && (
        <p className={cn("text-secondary-foreground mt-1.5 text-[13px]", config.maxDescWidth)}>
          {description}
        </p>
      )}

      {showCTA && (
        <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row">
          {cta.href ? (
            <Button
              variant={cta.intent === "secondary" ? "outline" : "default"}
              disabled={cta.isLoading}
              asChild
            >
              <Link href={cta.href}>{cta.label}</Link>
            </Button>
          ) : (
            <Button
              variant={cta.intent === "secondary" ? "outline" : "default"}
              onClick={cta.onClick}
              disabled={cta.isLoading}
            >
              {cta.label}
            </Button>
          )}
        </div>
      )}

      {ctaSecondary && (
        <Link href={ctaSecondary.href} className="text-info mt-2.5 text-xs hover:underline">
          {ctaSecondary.label} &rarr;
        </Link>
      )}
    </div>
  );
}

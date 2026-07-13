/**
 * EntityItem — data-driven renderable entity row (avatar/icon + title + description + actions).
 *
 * Composes the ReUI Item primitive with Avatar. Used by selection surfaces, list
 * regions, and inspector headers. All visible text is caller-supplied (already
 * translated), matching the EmptyPlaceholder/StatRow convention.
 *
 * Interaction is scoped to the title (Link or button) and to explicit actions —
 * the whole row is never made interactive, so action buttons never nest inside a
 * link/button (avoids the nested-interactive a11y trap).
 */

import { type ReactElement, type ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "@inertiajs/react";

import { getIcon } from "@/base/utils/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/primitives/reui/avatar";
import { Button } from "@/primitives/reui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/primitives/reui/item";

export interface EntityItemAvatar {
  /** Image URL. Falls back to `fallback` (typically initials) when missing or it fails to load. */
  src?: string;
  /** Fallback content, typically initials. */
  fallback?: string;
  /** Accessible label for the avatar image. */
  alt?: string;
}

export interface EntityItemAction {
  id: string;
  label: string;
  /** Icon registry key. */
  icon?: string;
  href?: string;
  onClick?: () => void;
  intent?: "primary" | "secondary";
  disabled?: boolean;
}

export interface EntityItemProps {
  title: ReactNode;
  description?: ReactNode;
  /** Avatar media. Takes precedence over `icon`. */
  avatar?: EntityItemAvatar;
  /** Icon registry key for icon media. Ignored when `avatar` is set. */
  icon?: string;
  actions?: EntityItemAction[];
  variant?: "default" | "outline" | "muted";
  size?: "default" | "sm";
  /** Makes the title a navigation link. */
  href?: string;
  /** Makes the title an action button. Ignored when `href` is set. */
  onClick?: () => void;
  className?: string;
}

export function EntityItem({
  title,
  description,
  avatar,
  icon,
  actions,
  variant = "default",
  size = "default",
  href,
  onClick,
  className,
}: EntityItemProps): ReactElement {
  const media = avatar ? (
    <Avatar size={size === "sm" ? "sm" : "default"}>
      {avatar.src && <AvatarImage src={avatar.src} alt={avatar.alt ?? ""} />}
      {avatar.fallback && <AvatarFallback>{avatar.fallback}</AvatarFallback>}
    </Avatar>
  ) : icon ? (
    <ItemMedia variant="icon">
      <HugeiconsIcon icon={getIcon(icon)} aria-hidden="true" />
    </ItemMedia>
  ) : null;

  const titleNode = href ? (
    <Link href={href} className="hover:text-primary hover:underline">
      {title}
    </Link>
  ) : onClick ? (
    <button
      type="button"
      onClick={onClick}
      className="hover:text-primary text-left hover:underline"
    >
      {title}
    </button>
  ) : (
    title
  );

  return (
    <Item variant={variant} size={size} className={className}>
      {media}
      <ItemContent>
        <ItemTitle>{titleNode}</ItemTitle>
        {description && <ItemDescription>{description}</ItemDescription>}
      </ItemContent>
      {actions && actions.length > 0 && (
        <ItemActions>
          {actions.map((action) => {
            const content = (
              <>
                {action.icon && (
                  <HugeiconsIcon
                    icon={getIcon(action.icon)}
                    className="size-4"
                    aria-hidden="true"
                  />
                )}
                {action.label}
              </>
            );
            const buttonVariant = action.intent === "primary" ? "default" : "outline";
            return action.href ? (
              <Button
                key={action.id}
                variant={buttonVariant}
                size="sm"
                disabled={action.disabled}
                asChild
              >
                <Link href={action.href}>{content}</Link>
              </Button>
            ) : (
              <Button
                key={action.id}
                variant={buttonVariant}
                size="sm"
                disabled={action.disabled}
                onClick={action.onClick}
              >
                {content}
              </Button>
            );
          })}
        </ItemActions>
      )}
    </Item>
  );
}

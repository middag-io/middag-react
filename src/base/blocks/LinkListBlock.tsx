/**
 * LinkListBlock — vertical list of links with icon, label, and description.
 *
 * Items with href: null are hidden. Internal destinations navigate through
 * Inertia; external links stay plain anchors and open in a new tab.
 *
 * @see ADR-807 block catalog
 */

import type { ReactElement } from "react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Link } from "@inertiajs/react";

import { getIcon } from "@/base/utils/icons";
import type { LinkListBlockData } from "@/contracts/block-data";
import type { BlockProps } from "@/engine/registries";
import { cn } from "@/lib/utils";

export function LinkListBlock({ block }: BlockProps<LinkListBlockData>): ReactElement {
  const { items } = block.data;
  const { meta } = block;
  const borderless = (meta as Record<string, unknown> | undefined)?.borderless === true;
  /**
   * Tighter rows, for a list that is a control rather than a destination.
   *
   * The default padding suits a handful of navigation links. A facet list runs
   * to a dozen entries of one short line each, and at three rems apiece it
   * outgrows the column it sits in.
   */
  const dense = (meta as Record<string, unknown> | undefined)?.dense === true;
  const visible = items.filter((item) => item.href != null);

  if (visible.length === 0) {
    return <></>;
  }

  return (
    <div className={cn(borderless ? "space-y-0.5" : "divide-border divide-y rounded-lg border")}>
      {visible.map((item, index) => {
        // Internal destinations go through Inertia so the page swaps instead of
        // reloading; a raw anchor threw away the whole document — and with it the
        // scroll position and every bit of client state — to move one link away.
        // External ones stay anchors: Inertia would try to render the response as
        // a page.
        const Anchor = item.external ? "a" : Link;
        return (
          <Anchor
            key={`${item.href}-${index}`}
            href={item.href!}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            className={cn(
              "flex gap-3 transition-colors",
              // Centred while dense: with one line of text the row reads as a
              // control, and top-alignment leaves the count sitting high.
              dense ? "items-center px-3 py-1.5" : "items-start px-4 py-3",
              borderless ? "hover:bg-accent/50 rounded-md" : "hover:bg-accent/50",
              item.active && "bg-accent text-accent-foreground font-medium",
            )}
            aria-current={item.active ? "true" : undefined}
          >
            {item.icon && (
              <HugeiconsIcon
                icon={getIcon(item.icon) as unknown as IconSvgElement}
                className="text-muted-foreground mt-0.5 size-4"
              />
            )}
            <div className="min-w-0 flex-1">
              <span className={cn("block truncate text-sm", !dense && "font-medium")}>
                {item.label}
              </span>
              {item.description && (
                <p className="text-muted-foreground text-xs">{item.description}</p>
              )}
            </div>
            {/* Pinned right, muted, and never squeezed — the label truncates first. */}
            {item.trailing && (
              <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                {item.trailing}
              </span>
            )}
            {item.external && (
              <HugeiconsIcon
                icon={ArrowUpRight01Icon as unknown as IconSvgElement}
                className="text-muted-foreground mt-0.5 size-3"
              />
            )}
          </Anchor>
        );
      })}
    </div>
  );
}

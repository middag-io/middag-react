/**
 * LinkListBlock — vertical list of links with icon, label, and description.
 *
 * Items with href: null are hidden. External links open in new tab.
 *
 * @see ADR-807 block catalog
 */

import type { ReactElement } from "react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

import { getIcon } from "@/base/utils/icons";
import type { LinkListBlockData } from "@/contracts/block-data";
import type { BlockProps } from "@/engine/registries";
import { cn } from "@/lib/utils";

export function LinkListBlock({ block }: BlockProps<LinkListBlockData>): ReactElement {
  const { items } = block.data;
  const { meta } = block;
  const borderless = (meta as Record<string, unknown> | undefined)?.borderless === true;
  const visible = items.filter((item) => item.href != null);

  if (visible.length === 0) {
    return <></>;
  }

  return (
    <div className={cn(borderless ? "space-y-0.5" : "divide-border divide-y rounded-lg border")}>
      {visible.map((item, index) => (
        <a
          key={`${item.href}-${index}`}
          href={item.href!}
          target={item.external ? "_blank" : undefined}
          rel={item.external ? "noopener noreferrer" : undefined}
          className={cn(
            "flex items-start gap-3 px-4 py-3 transition-colors",
            borderless ? "hover:bg-accent/50 rounded-md" : "hover:bg-accent/50",
          )}
        >
          {item.icon && (
            <HugeiconsIcon
              icon={getIcon(item.icon) as unknown as IconSvgElement}
              className="text-muted-foreground mt-0.5 size-4"
            />
          )}
          <div className="flex-1">
            <span className="text-sm font-medium">{item.label}</span>
            {item.description && (
              <p className="text-muted-foreground text-xs">{item.description}</p>
            )}
          </div>
          {item.external && (
            <HugeiconsIcon
              icon={ArrowUpRight01Icon as unknown as IconSvgElement}
              className="text-muted-foreground mt-0.5 size-3"
            />
          )}
        </a>
      ))}
    </div>
  );
}

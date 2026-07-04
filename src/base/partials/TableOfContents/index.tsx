/**
 * TableOfContents — anchor navigation for long content (DetailPanel, Markdown).
 *
 * Thin wrapper over the ReUI Scrollspy primitive: renders a nav of anchor links
 * that highlight the section currently in view and scroll-to on click. The caller
 * supplies the heading list (already translated) and a ref to the scroll container
 * whose sections carry matching `id` attributes.
 */

import { type ReactElement, type RefObject } from "react";

import { Scrollspy } from "@/components/reui/scrollspy";
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/lib/utils";

export interface TableOfContentsItem {
  /** Anchor id — must match the `id` of the target section element. */
  id: string;
  label: string;
  /** Heading level for indentation (2 = top-level, 3/4 = nested). Default 2. */
  level?: number;
}

export interface TableOfContentsProps {
  items: TableOfContentsItem[];
  /** Ref to the scrollable container holding the sections. Omit to track the document. */
  targetRef?: RefObject<HTMLElement | null>;
  /** Pixel offset applied when detecting/scrolling to a section. */
  offset?: number;
  /** Sync the active section to the URL hash. Default true. */
  history?: boolean;
  /** Accessible label for the nav. Defaults to a translated built-in. */
  ariaLabel?: string;
  className?: string;
}

const INDENT: Record<number, string> = {
  2: "",
  3: "pl-3",
  4: "pl-6",
};

export function TableOfContents({
  items,
  targetRef,
  offset = 0,
  history = true,
  ariaLabel,
  className,
}: TableOfContentsProps): ReactElement {
  const { t } = useTranslation();

  return (
    <nav
      aria-label={ariaLabel ?? t("middag.ui.table_of_contents.label")}
      className={cn("text-sm", className)}
    >
      <Scrollspy targetRef={targetRef} offset={offset} history={history}>
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => (
            <li key={item.id} className={INDENT[item.level ?? 2] ?? ""}>
              <a
                href={`#${item.id}`}
                data-scrollspy-anchor={item.id}
                className={cn(
                  "text-muted-foreground hover:text-foreground block border-l-2 border-transparent py-1 pl-3 transition-colors",
                  "data-[active=true]:border-primary data-[active=true]:text-foreground data-[active=true]:font-medium",
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </Scrollspy>
    </nav>
  );
}

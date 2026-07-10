import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/primitives/reui/pagination";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Pagination className="w-full max-w-xs">
      <PaginationContent className="w-full justify-between">
        <PaginationItem>
          <PaginationLink href="#" size="icon" aria-label="Go to previous page">
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              strokeWidth={2}
              className="size-4"
            />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <span className="text-muted-foreground text-sm">
            Page <span className="text-foreground font-medium">1</span> of{" "}
            <span className="text-foreground font-medium">10</span>
          </span>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" size="icon" aria-label="Go to next page">
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              strokeWidth={2}
              className="size-4"
            />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

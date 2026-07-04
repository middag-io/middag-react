import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/reui/pagination";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Pagination className="w-full max-w-xs">
      <PaginationContent className="w-full justify-between">
        <PaginationItem>
          <PaginationLink href="#" size="default" className="gap-2">
            <HugeiconsIcon
              icon={ArrowLeft02Icon}
              strokeWidth={2}
              className="size-4"
            />
            Previous
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" size="default" className="gap-2">
            Next
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              strokeWidth={2}
              className="size-4"
            />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

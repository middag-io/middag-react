import { Input } from "@/components/reui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/reui/pagination";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Pagination>
      <PaginationContent className="w-full justify-between">
        <PaginationItem className="flex items-center gap-1">
          <PaginationLink href="#" size="icon" aria-label="Go to previous page">
            <HugeiconsIcon
              icon={ArrowLeft01Icon}
              strokeWidth={2}
              className="size-4"
            />
          </PaginationLink>
          <PaginationLink href="#" isActive>
            1
          </PaginationLink>
          <PaginationLink href="#">2</PaginationLink>
          <PaginationLink href="#">3</PaginationLink>
          <PaginationLink href="#">4</PaginationLink>
          <PaginationEllipsis />
          <PaginationLink href="#" size="icon" aria-label="Go to next page">
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              strokeWidth={2}
              className="size-4"
            />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm whitespace-nowrap">
            Go to page
          </span>
          <Input
            type="number"
            min={1}
            max={10}
            defaultValue={1}
            className="h-9 w-16 text-center"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

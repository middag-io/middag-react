import { Card, CardContent } from "@/components/reui/card";
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
    <Card className="p-2">
      <CardContent className="p-0">
        <Pagination>
          <PaginationContent>
            {/* Previous */}
            <PaginationItem>
              <PaginationLink
                href="#"
                size="icon"
                aria-label="Go to previous page"
                className="hover:bg-muted h-8 w-8 rounded-full"
              >
                <HugeiconsIcon
                  icon={ArrowLeft01Icon}
                  strokeWidth={2}
                  className="size-4"
                />
              </PaginationLink>
            </PaginationItem>

            {[1, 2, 3].map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === 1}
                  className={
                    page === 1
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "hover:bg-muted"
                  }
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>

            {[10, 11, 12].map((page) => (
              <PaginationItem key={page}>
                <PaginationLink href="#">{page}</PaginationLink>
              </PaginationItem>
            ))}

            {/* Next */}
            <PaginationItem>
              <PaginationLink
                href="#"
                size="icon"
                aria-label="Go to next page"
                className="hover:bg-muted h-8 w-8 rounded-full"
              >
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  strokeWidth={2}
                  className="size-4"
                />
              </PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  );
}

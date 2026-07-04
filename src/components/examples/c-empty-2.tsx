import { Button } from "@/components/reui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/reui/empty";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <Empty className="bg-muted">
        <EmptyHeader>
          <EmptyTitle>No results found</EmptyTitle>
          <EmptyDescription>
            No results found for your search. Try adjusting your search terms.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button>Try again</Button>
          <Button variant="link" asChild className="text-muted-foreground">
            <a href="#">
              Learn more{" "}
              <HugeiconsIcon icon={ArrowUpRight01Icon} strokeWidth={2} />
            </a>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}

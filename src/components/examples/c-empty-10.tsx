import { Button } from "@/components/reui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/reui/empty";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChartBarLineIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex items-center justify-center p-4">
      <Empty className="border py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HugeiconsIcon icon={ChartBarLineIcon} strokeWidth={2} />
          </EmptyMedia>
          <EmptyTitle>No data yet</EmptyTitle>
          <EmptyDescription>
            Once your project starts receiving traffic, analytics will appear
            here.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button size="sm">Connect Data Source</Button>
            <Button variant="outline" size="sm">
              View Docs
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/primitives/reui/empty";
import { HugeiconsIcon } from "@hugeicons/react";
import { NotificationOff03Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex items-center justify-center p-4">
      <Empty className="bg-muted py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <HugeiconsIcon icon={NotificationOff03Icon} strokeWidth={2} />
          </EmptyMedia>
          <EmptyTitle>No notifications</EmptyTitle>
          <EmptyDescription>
            When you get notifications, they&apos;ll show up here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}

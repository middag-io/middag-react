import { Badge } from "@/components/reui/badge";

import { Button } from "@/components/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { NotificationIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Button
      size="icon"
      variant="outline"
      className="relative"
      aria-label="Notifications (8)"
    >
      <HugeiconsIcon
        icon={NotificationIcon}
        strokeWidth={2}
        aria-hidden="true"
      />
      <Badge
        variant="destructive"
        size="xs"
        className="absolute -top-1 -right-1 rounded-full px-1"
        aria-hidden="true"
      >
        8
      </Badge>
    </Button>
  );
}

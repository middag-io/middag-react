import { Button } from "@/primitives/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { NotificationIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Button size="icon-sm" variant="ghost" aria-label="Notifications">
      <HugeiconsIcon
        icon={NotificationIcon}
        strokeWidth={2}
        aria-hidden="true"
      />
    </Button>
  );
}

import { Badge } from "@/primitives/reui/badge";

import { Button } from "@/primitives/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { MailIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Button
      variant="outline"
      className="relative gap-2"
      aria-label="Inbox (8 unread)"
    >
      <HugeiconsIcon icon={MailIcon} strokeWidth={2} aria-hidden="true" />
      Inbox
      <Badge
        variant="destructive"
        size="sm"
        className="absolute -top-1.5 -right-2 rounded-full px-1"
        aria-hidden="true"
      >
        8
      </Badge>
    </Button>
  );
}

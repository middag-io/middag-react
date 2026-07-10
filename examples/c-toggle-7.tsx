import { useState } from "react";
import { Badge } from "@/components/reui/badge";

import { Toggle } from "@/components/reui/toggle";
import { HugeiconsIcon } from "@hugeicons/react";
import { NotificationIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  const [pressed, setPressed] = useState(false);

  return (
    <div className="flex items-center justify-center">
      <Toggle
        aria-label="Toggle notifications"
        pressed={pressed}
        onPressedChange={setPressed}
      >
        <div className="relative">
          <HugeiconsIcon icon={NotificationIcon} strokeWidth={2} />
          {!pressed && (
            <Badge
              variant="destructive"
              size="xs"
              className="absolute -top-2 -right-2 rounded-full!"
            >
              3
            </Badge>
          )}
        </div>
      </Toggle>
    </div>
  );
}

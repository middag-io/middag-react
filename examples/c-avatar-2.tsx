import { Avatar, AvatarFallback } from "@/components/reui/avatar";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarFallback>AJ</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>
          <HugeiconsIcon
            icon={UserIcon}
            strokeWidth={2}
            className="size-4"
            aria-hidden="true"
          />
        </AvatarFallback>
      </Avatar>
    </div>
  );
}

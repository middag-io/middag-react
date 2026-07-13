import { Button } from "@/primitives/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Button className="pe-0" variant="outline">
      <HugeiconsIcon icon={StarIcon} strokeWidth={2} aria-hidden="true" />
      Star
      <span className="text-muted-foreground before:bg-border relative ms-1 px-2 text-xs font-medium before:absolute before:inset-0 before:left-0 before:w-px">
        589
      </span>
    </Button>
  );
}

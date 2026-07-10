import { Button } from "@/primitives/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { MultiplicationSignIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Button size="icon-xs" variant="outline" aria-label="Close">
      <HugeiconsIcon
        icon={MultiplicationSignIcon}
        strokeWidth={2}
        aria-hidden="true"
      />
    </Button>
  );
}

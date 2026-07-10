import { Button } from "@/components/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { FilterHorizontalIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Button variant="outline">
      Options
      <HugeiconsIcon
        icon={FilterHorizontalIcon}
        strokeWidth={2}
        aria-hidden="true"
      />
    </Button>
  );
}

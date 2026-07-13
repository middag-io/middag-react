import { Button } from "@/primitives/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Button variant="destructive">
      Confirm Removal
      <HugeiconsIcon
        icon={AlertCircleIcon}
        strokeWidth={2}
        aria-hidden="true"
      />
    </Button>
  );
}

import { Button } from "@/components/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Button variant="destructive">
      <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} aria-hidden="true" />
      Delete Account
    </Button>
  );
}

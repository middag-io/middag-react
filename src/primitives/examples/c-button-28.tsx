import { Button } from "@/primitives/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { HelpCircleIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Button variant="link">
      <HugeiconsIcon icon={HelpCircleIcon} strokeWidth={2} aria-hidden="true" />
      Help Center
    </Button>
  );
}

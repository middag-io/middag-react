import { Button } from "@/primitives/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Button variant="outline">
      <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} aria-hidden="true" />
      Add Item
    </Button>
  );
}

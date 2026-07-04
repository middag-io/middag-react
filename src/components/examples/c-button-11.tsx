import { Button } from "@/components/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Button size="icon" aria-label="Search">
      <HugeiconsIcon icon={Search01Icon} strokeWidth={2} aria-hidden="true" />
    </Button>
  );
}

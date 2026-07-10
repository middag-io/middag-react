import { Button } from "@/components/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ZapIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Button size="lg">
      <HugeiconsIcon icon={ZapIcon} strokeWidth={2} aria-hidden="true" />
      Upgrade Now
    </Button>
  );
}

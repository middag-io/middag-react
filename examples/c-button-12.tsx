import { Button } from "@/components/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Button>
      Get Started
      <HugeiconsIcon
        icon={ArrowRight02Icon}
        strokeWidth={2}
        aria-hidden="true"
      />
    </Button>
  );
}

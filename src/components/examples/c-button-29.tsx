import { Button } from "@/components/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Button variant="link" className="group/link-button">
      View Documentation
      <HugeiconsIcon
        icon={ArrowUpRight01Icon}
        strokeWidth={2}
        aria-hidden="true"
        className="transition-transform group-hover/link-button:rotate-45"
      />
    </Button>
  );
}

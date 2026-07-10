import { Button } from "@/components/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { LinkSquare01Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Button variant="secondary">
      Open Project
      <HugeiconsIcon
        icon={LinkSquare01Icon}
        strokeWidth={2}
        aria-hidden="true"
      />
    </Button>
  );
}

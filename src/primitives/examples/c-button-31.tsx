import { Button } from "@/primitives/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { SentIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Button size="lg">
      Send Message
      <HugeiconsIcon icon={SentIcon} strokeWidth={2} aria-hidden="true" />
    </Button>
  );
}

import { Button } from "@/components/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlayIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Button size="icon-lg" aria-label="Play">
      <HugeiconsIcon icon={PlayIcon} strokeWidth={2} aria-hidden="true" />
    </Button>
  );
}

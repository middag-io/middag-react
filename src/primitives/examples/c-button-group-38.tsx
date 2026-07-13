import { Button } from "@/primitives/reui/button";
import { ButtonGroup } from "@/primitives/reui/button-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { PreviousIcon, PlayIcon, NextIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="icon" aria-label="Skip back">
        <HugeiconsIcon icon={PreviousIcon} strokeWidth={2} aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon" aria-label="Play">
        <HugeiconsIcon icon={PlayIcon} strokeWidth={2} aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon" aria-label="Skip forward">
        <HugeiconsIcon icon={NextIcon} strokeWidth={2} aria-hidden="true" />
      </Button>
    </ButtonGroup>
  );
}

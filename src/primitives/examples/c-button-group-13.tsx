import { Button } from "@/primitives/reui/button";
import { ButtonGroup } from "@/primitives/reui/button-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, MinusSignIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <ButtonGroup orientation="vertical">
      <Button variant="outline" size="icon" aria-label="Add">
        <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon" aria-label="Subtract">
        <HugeiconsIcon
          icon={MinusSignIcon}
          strokeWidth={2}
          aria-hidden="true"
        />
      </Button>
    </ButtonGroup>
  );
}

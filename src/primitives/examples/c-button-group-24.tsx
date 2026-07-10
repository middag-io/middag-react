import { Button } from "@/primitives/reui/button";
import { ButtonGroup } from "@/primitives/reui/button-group";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  GridViewIcon,
  Menu01Icon,
  GridTableIcon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="icon" aria-label="Grid view">
        <HugeiconsIcon icon={GridViewIcon} strokeWidth={2} aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon" aria-label="List view">
        <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon" aria-label="Table view">
        <HugeiconsIcon
          icon={GridTableIcon}
          strokeWidth={2}
          aria-hidden="true"
        />
      </Button>
    </ButtonGroup>
  );
}

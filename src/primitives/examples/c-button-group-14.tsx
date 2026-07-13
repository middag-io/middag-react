import { Button } from "@/primitives/reui/button";
import { ButtonGroup } from "@/primitives/reui/button-group";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  CopyIcon,
  Upload01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <ButtonGroup orientation="vertical">
      <ButtonGroup orientation="vertical">
        <Button variant="outline" size="icon" aria-label="Search">
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            aria-hidden="true"
          />
        </Button>
        <Button variant="outline" size="icon" aria-label="Copy">
          <HugeiconsIcon icon={CopyIcon} strokeWidth={2} aria-hidden="true" />
        </Button>
        <Button variant="outline" size="icon" aria-label="Share">
          <HugeiconsIcon
            icon={Upload01Icon}
            strokeWidth={2}
            aria-hidden="true"
          />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon" aria-label="Trash">
          <HugeiconsIcon
            icon={Delete02Icon}
            strokeWidth={2}
            aria-hidden="true"
          />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  );
}

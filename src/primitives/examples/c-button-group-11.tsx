import { Button } from "@/primitives/reui/button";
import { ButtonGroup } from "@/primitives/reui/button-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon-sm">
          <HugeiconsIcon
            icon={ArrowLeft02Icon}
            strokeWidth={2}
            aria-hidden="true"
          />
        </Button>
        <Button variant="outline" size="sm">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          3
        </Button>
        <Button variant="outline" size="icon-sm">
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            strokeWidth={2}
            aria-hidden="true"
          />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  );
}

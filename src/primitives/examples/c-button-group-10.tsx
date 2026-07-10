import { Button } from "@/primitives/reui/button";
import { ButtonGroup } from "@/primitives/reui/button-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="sm">
        <HugeiconsIcon
          icon={ArrowLeft02Icon}
          strokeWidth={2}
          aria-hidden="true"
        />
        Previous
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
      <Button variant="outline" size="sm">
        Next
        <HugeiconsIcon
          icon={ArrowRight02Icon}
          strokeWidth={2}
          aria-hidden="true"
        />
      </Button>
    </ButtonGroup>
  );
}

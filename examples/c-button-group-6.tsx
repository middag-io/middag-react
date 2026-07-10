import { Button } from "@/components/reui/button";
import { ButtonGroup } from "@/components/reui/button-group";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BorderHorizontalIcon,
  BorderVerticalIcon,
  Rotate01Icon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="icon">
        <HugeiconsIcon
          icon={BorderHorizontalIcon}
          strokeWidth={2}
          aria-hidden="true"
        />
      </Button>
      <Button variant="outline" size="icon">
        <HugeiconsIcon
          icon={BorderVerticalIcon}
          strokeWidth={2}
          aria-hidden="true"
        />
      </Button>
      <Button variant="outline" size="icon">
        <HugeiconsIcon icon={Rotate01Icon} strokeWidth={2} aria-hidden="true" />
      </Button>
    </ButtonGroup>
  );
}

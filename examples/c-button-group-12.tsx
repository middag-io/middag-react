import { Button } from "@/components/reui/button";
import { ButtonGroup } from "@/components/reui/button-group";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="icon-sm" aria-label="Align left">
        <HugeiconsIcon
          icon={TextAlignLeftIcon}
          strokeWidth={2}
          aria-hidden="true"
        />
      </Button>
      <Button variant="outline" size="icon-sm" aria-label="Align center">
        <HugeiconsIcon
          icon={TextAlignCenterIcon}
          strokeWidth={2}
          aria-hidden="true"
        />
      </Button>
      <Button variant="outline" size="icon-sm" aria-label="Align right">
        <HugeiconsIcon
          icon={TextAlignRightIcon}
          strokeWidth={2}
          aria-hidden="true"
        />
      </Button>
      <Button variant="outline" size="icon-sm" aria-label="Align justify">
        <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} aria-hidden="true" />
      </Button>
    </ButtonGroup>
  );
}

import { Badge } from "@/components/reui/badge";

import { Button } from "@/components/reui/button";
import { ButtonGroup } from "@/components/reui/button-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { File02Icon, PenIcon, Upload01Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant="outline">
        <HugeiconsIcon icon={File02Icon} strokeWidth={2} aria-hidden="true" />
        <Badge variant="warning-light">Draft</Badge>
      </Button>

      <Button variant="outline">
        <HugeiconsIcon icon={PenIcon} strokeWidth={2} aria-hidden="true" />
        <span>Edit</span>
      </Button>

      <Button variant="outline" size="icon">
        <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} aria-hidden="true" />
      </Button>
    </ButtonGroup>
  );
}

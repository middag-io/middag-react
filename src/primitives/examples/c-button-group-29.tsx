import { Button } from "@/primitives/reui/button";
import { ButtonGroup, ButtonGroupText } from "@/primitives/reui/button-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserAdd01Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <ButtonGroup>
      <Button size="sm" variant="outline">
        <HugeiconsIcon
          icon={UserAdd01Icon}
          strokeWidth={2}
          aria-hidden="true"
        />
        Follow
      </Button>
      <ButtonGroupText className="text-muted-foreground">
        2.4k followers
      </ButtonGroupText>
    </ButtonGroup>
  );
}

import { Button } from "@/primitives/reui/button";
import { ButtonGroup, ButtonGroupText } from "@/primitives/reui/button-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { Share08Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <ButtonGroup>
      <Button size="sm" className="border-primary">
        <HugeiconsIcon icon={Share08Icon} strokeWidth={2} className="..." />
        Share
      </Button>
      <ButtonGroupText className="text-muted-foreground bg-transparent px-2">
        128 Shares
      </ButtonGroupText>
    </ButtonGroup>
  );
}

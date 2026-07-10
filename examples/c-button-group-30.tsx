import { Button } from "@/components/reui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/reui/button-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <ButtonGroup>
      <Button
        size="sm"
        variant="default"
        aria-label="Following 2.4k"
        className="border-primary"
      >
        <HugeiconsIcon icon={StarIcon} strokeWidth={2} />
        Star
      </Button>
      <ButtonGroupText className="border-primary">2.4k</ButtonGroupText>
    </ButtonGroup>
  );
}

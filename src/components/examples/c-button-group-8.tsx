import { Button } from "@/components/reui/button";
import { ButtonGroup } from "@/components/reui/button-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { FavouriteIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant="outline">
        <HugeiconsIcon
          icon={FavouriteIcon}
          strokeWidth={2}
          aria-hidden="true"
        />
        Like
      </Button>
      <Button variant="outline" className="w-12" asChild>
        <span>1.2K</span>
      </Button>
    </ButtonGroup>
  );
}

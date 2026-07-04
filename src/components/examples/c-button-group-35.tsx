import { Button } from "@/components/reui/button";
import { ButtonGroup } from "@/components/reui/button-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="icon">
        <HugeiconsIcon
          icon={ArrowLeft01Icon}
          strokeWidth={2}
          aria-hidden="true"
        />
      </Button>
      <Button variant="outline" size="icon">
        1
      </Button>
      <Button variant="outline" size="icon">
        2
      </Button>
      <Button variant="default" size="icon" className="border-primary border">
        3
      </Button>
      <Button variant="outline" size="icon">
        4
      </Button>
      <Button variant="outline" size="icon">
        5
      </Button>
      <Button variant="outline" size="icon">
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          strokeWidth={2}
          aria-hidden="true"
        />
      </Button>
    </ButtonGroup>
  );
}

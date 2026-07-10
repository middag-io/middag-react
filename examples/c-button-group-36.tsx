import { cn } from "@/lib/utils";
import { Button } from "@/components/reui/button";
import { ButtonGroup } from "@/components/reui/button-group";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Menu01Icon,
  GridViewIcon,
  GridTableIcon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <ButtonGroup>
      <Button
        variant="outline"
        size="icon"
        className={cn("bg-muted")}
        aria-label="List view"
      >
        <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon" aria-label="Grid view">
        <HugeiconsIcon icon={GridViewIcon} strokeWidth={2} aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon" aria-label="Table view">
        <HugeiconsIcon
          icon={GridTableIcon}
          strokeWidth={2}
          aria-hidden="true"
        />
      </Button>
    </ButtonGroup>
  );
}

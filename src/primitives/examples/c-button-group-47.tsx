import { Button } from "@/primitives/reui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/primitives/reui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/primitives/reui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Tick02Icon,
  ArrowDown01Icon,
  CheckmarkCircle01Icon,
  Message02Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";

const icons = {
  check: <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} aria-hidden="true" />,
  chevronDown: (
    <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} aria-hidden="true" />
  ),
  checkCircle: (
    <HugeiconsIcon
      icon={CheckmarkCircle01Icon}
      strokeWidth={2}
      aria-hidden="true"
    />
  ),
  messageSquare: (
    <HugeiconsIcon icon={Message02Icon} strokeWidth={2} aria-hidden="true" />
  ),
  x: <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} aria-hidden="true" />,
};

export function Pattern() {
  return (
    <ButtonGroup className="**:data-[slot=button]:border-x-0">
      <Button variant="default">
        {icons.check}
        Approve
      </Button>
      <ButtonGroupSeparator className="bg-primary-foreground/20" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            size="icon"
            aria-label="More approval options"
          >
            {icons.chevronDown}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              {icons.checkCircle}
              Approve with Conditions
            </DropdownMenuItem>
            <DropdownMenuItem>
              {icons.messageSquare}
              Request Changes
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              {icons.x}
              Reject
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}

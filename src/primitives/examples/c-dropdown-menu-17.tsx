import { Button } from "@/primitives/reui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/primitives/reui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import { Notification01Icon, Tick02Icon } from "@hugeicons/core-free-icons";

const icons = {
  bell: (
    <HugeiconsIcon
      icon={Notification01Icon}
      strokeWidth={2}
      aria-hidden="true"
    />
  ),
  check: <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} aria-hidden="true" />,
};

export function Pattern() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          {icons.bell}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuItem>
            <span className="flex-1">New message from Alex</span>
            {icons.check}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span className="flex-1">Document approved</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span className="flex-1">Pipeline stage updated</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { Button } from "@/components/reui/button";
import { ButtonGroup } from "@/components/reui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/reui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlusSignIcon,
  MoreHorizontalCircle01Icon,
  UserAdd01Icon,
  ShoppingCart01Icon,
  File02Icon,
} from "@hugeicons/core-free-icons";

const icons = {
  plus: (
    <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} aria-hidden="true" />
  ),
  more: (
    <HugeiconsIcon
      icon={MoreHorizontalCircle01Icon}
      strokeWidth={2}
      aria-hidden="true"
    />
  ),
  userPlus: (
    <HugeiconsIcon icon={UserAdd01Icon} strokeWidth={2} aria-hidden="true" />
  ),
  cart: (
    <HugeiconsIcon
      icon={ShoppingCart01Icon}
      strokeWidth={2}
      aria-hidden="true"
    />
  ),
  fileText: (
    <HugeiconsIcon icon={File02Icon} strokeWidth={2} aria-hidden="true" />
  ),
};

export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="sm" aria-label="More options">
        {icons.plus}
        New
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon-sm" variant="outline" aria-label="More options">
            {icons.more}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Create</DropdownMenuLabel>
            <DropdownMenuItem>
              {icons.userPlus}
              New Customer
            </DropdownMenuItem>
            <DropdownMenuItem>
              {icons.cart}
              New Order
            </DropdownMenuItem>
            <DropdownMenuItem>
              {icons.fileText}
              New Invoice
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}

import { Avatar, AvatarFallback, AvatarImage } from "@/primitives/reui/avatar";
import { Button } from "@/primitives/reui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/primitives/reui/dropdown-menu";
import { Separator } from "@/primitives/reui/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlusSignIcon,
  UserAdd01Icon,
  ShoppingCart01Icon,
  File02Icon,
  Upload01Icon,
  UserIcon,
  CreditCardIcon,
  Settings01Icon,
  LogoutSquare01Icon,
} from "@hugeicons/core-free-icons";

const user = {
  name: "Alex Johnson",
  email: "alex@example.com",
  initials: "AJ",
};

export function Pattern() {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm">
            <HugeiconsIcon
              icon={PlusSignIcon}
              strokeWidth={2}
              aria-hidden="true"
            />
            New
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40" sideOffset={12}>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Create</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <HugeiconsIcon
                  icon={UserAdd01Icon}
                  strokeWidth={2}
                  className="size-4 opacity-60"
                  aria-hidden="true"
                />
                New Customer
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon
                  icon={ShoppingCart01Icon}
                  strokeWidth={2}
                  className="size-4 opacity-60"
                  aria-hidden="true"
                />
                New Order
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon
                  icon={File02Icon}
                  strokeWidth={2}
                  className="size-4 opacity-60"
                  aria-hidden="true"
                />
                New Invoice
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <HugeiconsIcon
                icon={Upload01Icon}
                strokeWidth={2}
                className="size-4 opacity-60"
                aria-hidden="true"
              />
              Import Data
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="my-auto h-4" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="size-6">
            <AvatarImage
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80"
              alt={user.name}
            />
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={12} className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-foreground text-sm">{user.name}</span>
                <span className="text-muted-foreground text-xs">
                  {user.email}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <HugeiconsIcon
                  icon={UserIcon}
                  strokeWidth={2}
                  className="size-4 opacity-60"
                  aria-hidden="true"
                />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon
                  icon={CreditCardIcon}
                  strokeWidth={2}
                  className="size-4 opacity-60"
                  aria-hidden="true"
                />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon
                  icon={Settings01Icon}
                  strokeWidth={2}
                  className="size-4 opacity-60"
                  aria-hidden="true"
                />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <HugeiconsIcon
                icon={LogoutSquare01Icon}
                strokeWidth={2}
                aria-hidden="true"
              />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

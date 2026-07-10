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
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UnfoldMoreIcon,
  UserIcon,
  SettingsIcon,
  PlusSignIcon,
  LogoutSquare01Icon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full h-8 gap-1.5 pr-2.5 pl-1"
        >
          <Avatar className="border-background size-6 border">
            <AvatarImage
              src="https://images.unsplash.com/photo-1542595913-85d69b0edbaf?w=96&h=96&dpr=2&q=80"
              alt="Liam Thompson"
            />
            <AvatarFallback>LT</AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium">Liam Thompson</span>
          <HugeiconsIcon
            icon={UnfoldMoreIcon}
            strokeWidth={2}
            className="size-3.5 opacity-60"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44" align="center" sideOffset={8}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Management</DropdownMenuLabel>
          <DropdownMenuItem>
            <HugeiconsIcon icon={UserIcon} strokeWidth={2} aria-hidden="true" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HugeiconsIcon
              icon={SettingsIcon}
              strokeWidth={2}
              aria-hidden="true"
            />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <HugeiconsIcon icon={UserIcon} strokeWidth={2} aria-hidden="true" />
            <span>Teams</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HugeiconsIcon
              icon={PlusSignIcon}
              strokeWidth={2}
              aria-hidden="true"
            />
            <span>Invite</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <HugeiconsIcon
            icon={LogoutSquare01Icon}
            strokeWidth={2}
            aria-hidden="true"
          />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

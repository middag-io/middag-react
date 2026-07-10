import { Avatar, AvatarFallback, AvatarImage } from "@/components/reui/avatar";
import { Button } from "@/components/reui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/reui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  UserIcon,
  CreditCardIcon,
  SettingsIcon,
  UserMultiple02Icon,
  PlusSignIcon,
  LifebuoyIcon,
  BookOpen01Icon,
  LogoutSquare01Icon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-52">
            <div className="gap-1.5 flex items-center">
              <Avatar className="size-5">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80"
                  alt="Alex Johnson"
                />
                <AvatarFallback>AJ</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Alex Johnson</span>
            </div>

            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={2}
              className="ml-auto size-4 opacity-60"
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center gap-2 py-2">
              <Avatar className="size-8">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80"
                  alt="Alex Johnson"
                />
                <AvatarFallback>AJ</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-foreground text-sm font-medium">
                  Alex Johnson
                </span>
                <span className="text-muted-foreground text-xs font-normal">
                  alex@example.com
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <HugeiconsIcon
                  icon={UserIcon}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon
                  icon={CreditCardIcon}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon
                  icon={SettingsIcon}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <HugeiconsIcon
                  icon={UserMultiple02Icon}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Team
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon
                  icon={PlusSignIcon}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Invite Members
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <HugeiconsIcon
                  icon={LifebuoyIcon}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Support
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon
                  icon={BookOpen01Icon}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Documentation
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <HugeiconsIcon
                icon={LogoutSquare01Icon}
                strokeWidth={2}
                aria-hidden="true"
              />
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

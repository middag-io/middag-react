import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/primitives/reui/avatar";
import { Button } from "@/primitives/reui/button";
import { ButtonGroup, ButtonGroupText } from "@/primitives/reui/button-group";
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
  UserMultiple02Icon,
  PlusSignIcon,
  ClockIcon,
  MoreHorizontalCircle01Icon,
  UserIcon,
  SettingsIcon,
  LinkSquare01Icon,
} from "@hugeicons/core-free-icons";

const team = [
  { name: "Shadcn", src: "https://github.com/shadcn.png", fallback: "CN" },
  { name: "Max", src: "https://github.com/maxleiter.png", fallback: "ML" },
  {
    name: "Evil Rabbit",
    src: "https://github.com/evilrabbit.png",
    fallback: "ER",
  },
];

export function Pattern() {
  return (
    <ButtonGroup>
      {/* Team Context */}
      <Button variant="outline">
        <HugeiconsIcon
          icon={UserMultiple02Icon}
          strokeWidth={2}
          aria-hidden="true"
        />
        <span>Team</span>
      </Button>

      {/* Active Members - Inspired by Avatar Patterns */}
      <ButtonGroupText className="gap-0 bg-transparent">
        <AvatarGroup>
          {team.map((member) => (
            <Avatar key={member.name} className="size-5">
              <AvatarImage src={member.src} alt={member.name} />
              <AvatarFallback>{member.fallback}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
        <div className="ml-2 flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-green-500" />
          <span className="text-muted-foreground text-xs font-medium">
            3 Live
          </span>
        </div>
      </ButtonGroupText>

      {/* Collaboration Actions */}
      <Button variant="outline" size="icon">
        <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} aria-hidden="true" />
      </Button>
      <Button variant="outline" size="icon">
        <HugeiconsIcon icon={ClockIcon} strokeWidth={2} aria-hidden="true" />
      </Button>

      {/* Options Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <HugeiconsIcon
              icon={MoreHorizontalCircle01Icon}
              strokeWidth={2}
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Team Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <HugeiconsIcon
                icon={UserIcon}
                strokeWidth={2}
                aria-hidden="true"
              />
              <span>Manage members</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HugeiconsIcon
                icon={SettingsIcon}
                strokeWidth={2}
                aria-hidden="true"
              />
              <span>Team preferences</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <HugeiconsIcon
              icon={LinkSquare01Icon}
              strokeWidth={2}
              aria-hidden="true"
            />
            <span>Open dashboard</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}

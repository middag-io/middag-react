import { Button } from "@/primitives/reui/button";
import { ButtonGroup, ButtonGroupText } from "@/primitives/reui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/primitives/reui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  GitMergeIcon,
  ArrowDown01Icon,
  GitBranchIcon,
  Tick02Icon,
  Refresh04Icon,
  LinkSquare01Icon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <ButtonGroup>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <HugeiconsIcon
              icon={GitMergeIcon}
              strokeWidth={2}
              aria-hidden="true"
            />
            <span>main</span>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={2}
              aria-hidden="true"
              className="size-3.5 opacity-60"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Switch Branch</DropdownMenuLabel>
            <DropdownMenuItem>
              <HugeiconsIcon
                icon={GitBranchIcon}
                strokeWidth={2}
                aria-hidden="true"
              />
              <span>main</span>
              <HugeiconsIcon
                icon={Tick02Icon}
                strokeWidth={2}
                aria-hidden="true"
                className="text-primary ml-auto size-3.5"
              />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HugeiconsIcon
                icon={GitBranchIcon}
                strokeWidth={2}
                aria-hidden="true"
              />
              <span>develop</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HugeiconsIcon
                icon={GitBranchIcon}
                strokeWidth={2}
                aria-hidden="true"
              />
              <span>feature/auth</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ButtonGroupText className="bg-transparent">
        <div className="size-1.5 animate-pulse rounded-full bg-green-600" />
        <span>Production</span>
      </ButtonGroupText>

      <Button variant="outline" size="icon">
        <HugeiconsIcon
          icon={Refresh04Icon}
          strokeWidth={2}
          aria-hidden="true"
        />
      </Button>

      <Button variant="outline" size="icon">
        <HugeiconsIcon
          icon={LinkSquare01Icon}
          strokeWidth={2}
          aria-hidden="true"
        />
      </Button>
    </ButtonGroup>
  );
}

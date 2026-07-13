import { Badge } from "@/primitives/reui/badge";

import { Button } from "@/primitives/reui/button";
import { ButtonGroup } from "@/primitives/reui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/primitives/reui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  StarIcon,
  ArrowDown01Icon,
  ViewIcon,
  GitForkIcon,
  ListSettingIcon,
  Share08Icon,
  NotificationIcon,
  Flag02Icon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant="outline">
        <HugeiconsIcon icon={StarIcon} strokeWidth={2} aria-hidden="true" />
        <span>Star</span>
        <Badge variant="secondary">2.4k</Badge>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={2}
              aria-hidden="true"
            />
            <span className="sr-only">Toggle dropdown</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuItem>
            <HugeiconsIcon icon={ViewIcon} strokeWidth={2} aria-hidden="true" />
            Watch
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HugeiconsIcon
              icon={GitForkIcon}
              strokeWidth={2}
              aria-hidden="true"
            />
            Fork
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HugeiconsIcon
              icon={ListSettingIcon}
              strokeWidth={2}
              aria-hidden="true"
            />
            Add to list
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <HugeiconsIcon
              icon={Share08Icon}
              strokeWidth={2}
              aria-hidden="true"
            />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HugeiconsIcon
              icon={NotificationIcon}
              strokeWidth={2}
              aria-hidden="true"
            />
            Notifications
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <HugeiconsIcon
              icon={Flag02Icon}
              strokeWidth={2}
              aria-hidden="true"
            />
            Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}

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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/primitives/reui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FilterIcon,
  Sorting04Icon,
  MoreHorizontalCircle01Icon,
  Copy01Icon,
  Share08Icon,
  Download01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";

const icons = {
  filter: (
    <HugeiconsIcon icon={FilterIcon} strokeWidth={2} aria-hidden="true" />
  ),
  sort: (
    <HugeiconsIcon icon={Sorting04Icon} strokeWidth={2} aria-hidden="true" />
  ),
  more: (
    <HugeiconsIcon
      icon={MoreHorizontalCircle01Icon}
      strokeWidth={2}
      aria-hidden="true"
    />
  ),
  copy: <HugeiconsIcon icon={Copy01Icon} strokeWidth={2} aria-hidden="true" />,
  share: (
    <HugeiconsIcon icon={Share08Icon} strokeWidth={2} aria-hidden="true" />
  ),
  download: (
    <HugeiconsIcon icon={Download01Icon} strokeWidth={2} aria-hidden="true" />
  ),
  settings: (
    <HugeiconsIcon icon={Settings01Icon} strokeWidth={2} aria-hidden="true" />
  ),
};

export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="sm" aria-label="Filter">
        {icons.filter}
      </Button>
      <Button variant="outline" size="sm" aria-label="Sort">
        {icons.sort}
      </Button>
      <ButtonGroupSeparator />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" aria-label="More options">
            {icons.more}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8}>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              {icons.copy}
              Copy link
            </DropdownMenuItem>
            <DropdownMenuItem>
              {icons.share}
              Share
            </DropdownMenuItem>
            <DropdownMenuItem>
              {icons.download}
              Export
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {icons.settings}
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}

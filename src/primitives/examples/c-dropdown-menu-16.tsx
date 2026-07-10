import { Button } from "@/primitives/reui/button";
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
  MoreHorizontalCircle01Icon,
  Settings01Icon,
  Share08Icon,
  DeleteIcon,
} from "@hugeicons/core-free-icons";

const icons = {
  more: (
    <HugeiconsIcon
      icon={MoreHorizontalCircle01Icon}
      strokeWidth={2}
      aria-hidden="true"
    />
  ),
  settings: (
    <HugeiconsIcon icon={Settings01Icon} strokeWidth={2} aria-hidden="true" />
  ),
  share: (
    <HugeiconsIcon icon={Share08Icon} strokeWidth={2} aria-hidden="true" />
  ),
  trash: <HugeiconsIcon icon={DeleteIcon} strokeWidth={2} aria-hidden="true" />,
};

export function Pattern() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="-me-1.5"
          aria-label="More options"
        >
          {icons.more}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-36">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            {icons.settings}
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            {icons.share}
            Share
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            {icons.trash}
            Remove
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

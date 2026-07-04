import { Button } from "@/components/reui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/reui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/reui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Refresh04Icon,
  Share08Icon,
  MoreHorizontalCircle01Icon,
  Pen01Icon,
  FileEditIcon,
  Image01Icon,
} from "@hugeicons/core-free-icons";

const icons = {
  refresh: (
    <HugeiconsIcon icon={Refresh04Icon} strokeWidth={2} aria-hidden="true" />
  ),
  share: (
    <HugeiconsIcon icon={Share08Icon} strokeWidth={2} aria-hidden="true" />
  ),
  more: (
    <HugeiconsIcon
      icon={MoreHorizontalCircle01Icon}
      strokeWidth={2}
      aria-hidden="true"
    />
  ),
  pencil: <HugeiconsIcon icon={Pen01Icon} strokeWidth={2} aria-hidden="true" />,
  fileText: (
    <HugeiconsIcon icon={FileEditIcon} strokeWidth={2} aria-hidden="true" />
  ),
  image: (
    <HugeiconsIcon icon={Image01Icon} strokeWidth={2} aria-hidden="true" />
  ),
};

export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="sm" aria-label="Refresh">
        {icons.refresh}
      </Button>
      <Button variant="outline" size="sm">
        {icons.share}
        Share
      </Button>
      <ButtonGroupSeparator />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" aria-label="More options">
            {icons.more}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44" sideOffset={9}>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              {icons.pencil}
              Edit dashboard
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {icons.fileText}
              Export CSV
            </DropdownMenuItem>
            <DropdownMenuItem>
              {icons.image}
              Export PNG
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}

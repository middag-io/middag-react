import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/primitives/reui/avatar";
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
import { Separator } from "@/primitives/reui/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  EyeIcon,
  Sent01Icon,
  ArrowDown01Icon,
  Calendar01Icon,
  FileEmpty02Icon,
  MoreHorizontalCircle01Icon,
  CopyIcon,
  Clock01Icon,
  Archive01Icon,
  Delete01Icon,
} from "@hugeicons/core-free-icons";

const viewers = [
  {
    src: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80",
    initials: "SC",
    name: "Sarah Chen",
  },
  {
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80",
    initials: "AJ",
    name: "Alex Johnson",
  },
];

export function Pattern() {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <AvatarGroup>
        {viewers.map((viewer) => (
          <Avatar key={viewer.name} size="sm">
            <AvatarImage src={viewer.src} alt={viewer.name} />
            <AvatarFallback>{viewer.initials}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>

      <Separator orientation="vertical" className="my-auto h-4" />

      <Button variant="outline" size="sm">
        <HugeiconsIcon icon={EyeIcon} strokeWidth={2} aria-hidden="true" />
        <span className="hidden md:block">Preview</span>
      </Button>

      <ButtonGroup className="**:data-[slot=button]:border-r-0">
        <Button size="sm">
          <HugeiconsIcon icon={Sent01Icon} strokeWidth={2} aria-hidden="true" />
          Publish
        </Button>

        <ButtonGroupSeparator className="bg-primary/72" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon-sm"
              className="border-primary-foreground/20 rounded-l-none border-l"
              aria-label="More publish options"
            >
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                strokeWidth={2}
                aria-hidden="true"
              />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent sideOffset={8} align="end" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <HugeiconsIcon
                  icon={Calendar01Icon}
                  strokeWidth={2}
                  className="size-4 opacity-60"
                  aria-hidden="true"
                />
                Schedule for later
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon
                  icon={FileEmpty02Icon}
                  strokeWidth={2}
                  className="size-4 opacity-60"
                  aria-hidden="true"
                />
                Save as draft
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="More actions">
            <HugeiconsIcon
              icon={MoreHorizontalCircle01Icon}
              strokeWidth={2}
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent sideOffset={8} align="end" className="w-40">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <HugeiconsIcon
                icon={CopyIcon}
                strokeWidth={2}
                className="size-4 opacity-60"
                aria-hidden="true"
              />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HugeiconsIcon
                icon={Clock01Icon}
                strokeWidth={2}
                className="size-4 opacity-60"
                aria-hidden="true"
              />
              View history
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HugeiconsIcon
                icon={Archive01Icon}
                strokeWidth={2}
                className="size-4 opacity-60"
                aria-hidden="true"
              />
              Archive
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <HugeiconsIcon
                icon={Delete01Icon}
                strokeWidth={2}
                aria-hidden="true"
              />
              Delete
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

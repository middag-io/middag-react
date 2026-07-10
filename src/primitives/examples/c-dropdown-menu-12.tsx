import { Button } from "@/primitives/reui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/primitives/reui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MoreVerticalIcon,
  PenIcon,
  CopyIcon,
  ArrowRight02Icon,
  FolderIcon,
  Archive02Icon,
  StarIcon,
  Share08Icon,
  Link01Icon,
  DeleteIcon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <HugeiconsIcon
              icon={MoreVerticalIcon}
              strokeWidth={2}
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <HugeiconsIcon
                icon={PenIcon}
                strokeWidth={2}
                aria-hidden="true"
              />
              Edit
              <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HugeiconsIcon
                icon={CopyIcon}
                strokeWidth={2}
                aria-hidden="true"
              />
              Duplicate
              <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Move to
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    <HugeiconsIcon
                      icon={FolderIcon}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    Projects
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HugeiconsIcon
                      icon={Archive02Icon}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HugeiconsIcon
                      icon={StarIcon}
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    Favorites
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
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
                icon={Link01Icon}
                strokeWidth={2}
                aria-hidden="true"
              />
              Copy Link
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <HugeiconsIcon
              icon={DeleteIcon}
              strokeWidth={2}
              aria-hidden="true"
            />
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

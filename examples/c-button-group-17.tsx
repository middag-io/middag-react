import { Button } from "@/components/reui/button";
import { ButtonGroup } from "@/components/reui/button-group";
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
  Message02Icon,
  MoreVerticalIcon,
  VolumeMute02Icon,
  Tick02Icon,
  Alert02Icon,
  UserRemove01Icon,
  Upload01Icon,
  CopyIcon,
  DeleteIcon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant="outline">
        <HugeiconsIcon
          icon={Message02Icon}
          strokeWidth={2}
          aria-hidden="true"
        />
        <span>Conversation</span>
      </Button>
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
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <HugeiconsIcon
                icon={VolumeMute02Icon}
                strokeWidth={2}
                aria-hidden="true"
              />
              Mute Conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HugeiconsIcon
                icon={Tick02Icon}
                strokeWidth={2}
                aria-hidden="true"
              />
              Mark as Read
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HugeiconsIcon
                icon={Alert02Icon}
                strokeWidth={2}
                aria-hidden="true"
              />
              Report Conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HugeiconsIcon
                icon={UserRemove01Icon}
                strokeWidth={2}
                aria-hidden="true"
              />
              Block User
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HugeiconsIcon
                icon={Upload01Icon}
                strokeWidth={2}
                aria-hidden="true"
              />
              Share Conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HugeiconsIcon
                icon={CopyIcon}
                strokeWidth={2}
                aria-hidden="true"
              />
              Copy Link
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">
              <HugeiconsIcon
                icon={DeleteIcon}
                strokeWidth={2}
                aria-hidden="true"
              />
              Delete Conversation
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}

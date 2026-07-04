import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/reui/context-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PenIcon,
  Upload01Icon,
  Archive02Icon,
  DeleteIcon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex w-full items-center justify-center p-12">
      <ContextMenu>
        <ContextMenuTrigger className="text-muted-foreground rounded-4xl flex aspect-[2/0.5] w-full max-w-[300px] items-center justify-center border border-dashed text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuItem>
              <HugeiconsIcon icon={PenIcon} strokeWidth={2} />
              Edit
            </ContextMenuItem>
            <ContextMenuItem>
              <HugeiconsIcon icon={Upload01Icon} strokeWidth={2} />
              Share
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuItem>
              <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />
              Archive
            </ContextMenuItem>
            <ContextMenuItem variant="destructive">
              <HugeiconsIcon icon={DeleteIcon} strokeWidth={2} />
              Delete
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}

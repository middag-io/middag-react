import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/primitives/reui/context-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CopyIcon,
  ScissorIcon,
  ClipboardIcon,
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
              <HugeiconsIcon icon={CopyIcon} strokeWidth={2} />
              Copy
            </ContextMenuItem>
            <ContextMenuItem>
              <HugeiconsIcon icon={ScissorIcon} strokeWidth={2} />
              Cut
            </ContextMenuItem>
            <ContextMenuItem>
              <HugeiconsIcon icon={ClipboardIcon} strokeWidth={2} />
              Paste
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
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

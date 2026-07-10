import { Button } from "@/primitives/reui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/primitives/reui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/primitives/reui/dialog";
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
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Context Menu Example</DialogTitle>
            <DialogDescription>
              Right click on the area below to see the context menu.
            </DialogDescription>
          </DialogHeader>
          <ContextMenu>
            <ContextMenuTrigger className="text-muted-foreground rounded-4xl flex aspect-[2/0.5] w-full items-center justify-center border border-dashed text-sm">
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
              <ContextMenuSub>
                <ContextMenuSubTrigger>More Options</ContextMenuSubTrigger>
                <ContextMenuSubContent>
                  <ContextMenuGroup>
                    <ContextMenuItem>Save Page...</ContextMenuItem>
                    <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                    <ContextMenuItem>Name Window...</ContextMenuItem>
                  </ContextMenuGroup>
                  <ContextMenuSeparator />
                  <ContextMenuGroup>
                    <ContextMenuItem>Developer Tools</ContextMenuItem>
                  </ContextMenuGroup>
                </ContextMenuSubContent>
              </ContextMenuSub>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem variant="destructive">
                  <HugeiconsIcon icon={DeleteIcon} strokeWidth={2} />
                  Delete
                </ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuContent>
          </ContextMenu>
        </DialogContent>
      </Dialog>
    </div>
  );
}

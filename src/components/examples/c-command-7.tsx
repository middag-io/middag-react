import { useState } from "react";

import { Button } from "@/components/reui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/reui/command";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlusSignIcon,
  File02Icon,
  UserAdd01Icon,
  Home03Icon,
  InboxIcon,
  Moon02Icon,
  LogoutSquare01Icon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        Quick Actions
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="**:data-[selected=true]:bg-muted **:data-selected:bg-transparent">
          <CommandInput placeholder="What do you need?" />
          <CommandList>
            <CommandEmpty>No actions found.</CommandEmpty>
            <CommandGroup heading="Create">
              <CommandItem>
                <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
                <span>New Project</span>
                <CommandShortcut>⌘N</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={File02Icon} strokeWidth={2} />
                <span>New Document</span>
                <CommandShortcut>⌘⇧N</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={UserAdd01Icon} strokeWidth={2} />
                <span>Invite Member</span>
                <CommandShortcut>⌘I</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Navigate">
              <CommandItem>
                <HugeiconsIcon icon={Home03Icon} strokeWidth={2} />
                <span>Go to Dashboard</span>
                <CommandShortcut>⌘D</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={InboxIcon} strokeWidth={2} />
                <span>Go to Inbox</span>
                <CommandShortcut>⌘⇧I</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="System">
              <CommandItem>
                <HugeiconsIcon icon={Moon02Icon} strokeWidth={2} />
                <span>Toggle Dark Mode</span>
                <CommandShortcut>⌘⇧D</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={LogoutSquare01Icon} strokeWidth={2} />
                <span>Sign Out</span>
                <CommandShortcut>⌘Q</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}

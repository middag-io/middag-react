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
  Calendar04Icon,
  SmileIcon,
  Calculator01Icon,
  UserIcon,
  CreditCardIcon,
  SettingsIcon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        Open Command
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="**:data-[selected=true]:bg-muted **:data-selected:bg-transparent">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>
                <HugeiconsIcon icon={Calendar04Icon} strokeWidth={2} />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={SmileIcon} strokeWidth={2} />
                <span>Search Emoji</span>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={Calculator01Icon} strokeWidth={2} />
                <span>Calculator</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>
                <HugeiconsIcon icon={UserIcon} strokeWidth={2} />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={SettingsIcon} strokeWidth={2} />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}

"use client";

import { useState } from "react";

import { Button } from "@/primitives/reui/button";
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
} from "@/primitives/reui/command";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  StarIcon,
  ClockIcon,
  BookOpen01Icon,
  LifebuoyIcon,
  Message02Icon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        Search Everything
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="**:data-[selected=true]:bg-muted **:data-selected:bg-transparent">
          <CommandInput placeholder="Search or jump to..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Favorites">
              <CommandItem>
                <HugeiconsIcon
                  icon={StarIcon}
                  strokeWidth={2}
                  className="text-yellow-500"
                />
                <span>Design System</span>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon
                  icon={StarIcon}
                  strokeWidth={2}
                  className="text-yellow-500"
                />
                <span>API Documentation</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Recent">
              <CommandItem>
                <HugeiconsIcon
                  icon={ClockIcon}
                  strokeWidth={2}
                  className="text-muted-foreground"
                />
                <span>Dashboard Analytics</span>
                <div className="ml-auto" data-slot="command-shortcut">
                  <span>2m ago</span>
                </div>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon
                  icon={ClockIcon}
                  strokeWidth={2}
                  className="text-muted-foreground"
                />
                <span>User Settings</span>
                <div className="ml-auto" data-slot="command-shortcut">
                  <span>15m ago</span>
                </div>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon
                  icon={ClockIcon}
                  strokeWidth={2}
                  className="text-muted-foreground"
                />
                <div className="flex flex-1 items-center justify-between">
                  <span>Team Members</span>
                  <div className="ml-auto" data-slot="command-shortcut">
                    <span>1h ago</span>
                  </div>
                </div>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon
                  icon={ClockIcon}
                  strokeWidth={2}
                  className="text-muted-foreground"
                />
                <span>Billing & Plans</span>
                <div className="ml-auto" data-slot="command-shortcut">
                  <span>2h ago</span>
                </div>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Quick Links">
              <CommandItem>
                <HugeiconsIcon icon={BookOpen01Icon} strokeWidth={2} />
                <span>Documentation</span>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={LifebuoyIcon} strokeWidth={2} />
                <span>Help & Support</span>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={Message02Icon} strokeWidth={2} />
                <span>Contact Us</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}

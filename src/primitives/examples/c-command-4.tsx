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
  Home03Icon,
  InboxIcon,
  File02Icon,
  FolderIcon,
  PlusSignIcon,
  FolderAddIcon,
  CopyIcon,
  ScissorIcon,
  ClipboardIcon,
  DeleteIcon,
  GridViewIcon,
  Menu01Icon,
  SearchAddIcon,
  SearchMinusIcon,
  UserIcon,
  CreditCardIcon,
  SettingsIcon,
  NotificationIcon,
  HelpCircleIcon,
  Calculator01Icon,
  Calendar04Icon,
  ImageIcon,
  CodeSimpleIcon,
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
            <CommandGroup heading="Navigation">
              <CommandItem>
                <HugeiconsIcon icon={Home03Icon} strokeWidth={2} />
                <span>Home</span>
                <CommandShortcut>⌘H</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={InboxIcon} strokeWidth={2} />
                <span>Inbox</span>
                <CommandShortcut>⌘I</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={File02Icon} strokeWidth={2} />
                <span>Documents</span>
                <CommandShortcut>⌘D</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={FolderIcon} strokeWidth={2} />
                <span>Folders</span>
                <CommandShortcut>⌘F</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Actions">
              <CommandItem>
                <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
                <span>New File</span>
                <CommandShortcut>⌘N</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={FolderAddIcon} strokeWidth={2} />
                <span>New Folder</span>
                <CommandShortcut>⇧⌘N</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={CopyIcon} strokeWidth={2} />
                <span>Copy</span>
                <CommandShortcut>⌘C</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={ScissorIcon} strokeWidth={2} />
                <span>Cut</span>
                <CommandShortcut>⌘X</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={ClipboardIcon} strokeWidth={2} />
                <span>Paste</span>
                <CommandShortcut>⌘V</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={DeleteIcon} strokeWidth={2} />
                <span>Delete</span>
                <CommandShortcut>⌫</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="View">
              <CommandItem>
                <HugeiconsIcon icon={GridViewIcon} strokeWidth={2} />
                <span>Grid View</span>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} />
                <span>List View</span>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={SearchAddIcon} strokeWidth={2} />
                <span>Zoom In</span>
                <CommandShortcut>⌘+</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={SearchMinusIcon} strokeWidth={2} />
                <span>Zoom Out</span>
                <CommandShortcut>⌘-</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Account">
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
              <CommandItem>
                <HugeiconsIcon icon={NotificationIcon} strokeWidth={2} />
                <span>Notifications</span>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={HelpCircleIcon} strokeWidth={2} />
                <span>Help & Support</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Tools">
              <CommandItem>
                <HugeiconsIcon icon={Calculator01Icon} strokeWidth={2} />
                <span>Calculator</span>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={Calendar04Icon} strokeWidth={2} />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={ImageIcon} strokeWidth={2} />
                <span>Image Editor</span>
              </CommandItem>
              <CommandItem>
                <HugeiconsIcon icon={CodeSimpleIcon} strokeWidth={2} />
                <span>Code Editor</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}

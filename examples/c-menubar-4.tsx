import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/reui/menubar";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FileEmpty02Icon,
  FolderIcon,
  FloppyDiskIcon,
  UserIcon,
  LogoutSquare01Icon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <HugeiconsIcon icon={FileEmpty02Icon} strokeWidth={2} />
              New File <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <HugeiconsIcon icon={FolderIcon} strokeWidth={2} />
              Open Folder
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <HugeiconsIcon icon={FloppyDiskIcon} strokeWidth={2} />
              Save <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Account</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarItem>
                <HugeiconsIcon icon={UserIcon} strokeWidth={2} />
                Profile
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem variant="destructive">
                <HugeiconsIcon icon={LogoutSquare01Icon} strokeWidth={2} />
                Sign out
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}

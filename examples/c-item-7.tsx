import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/reui/item";
import { Kbd } from "@/components/reui/kbd";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  PlusSignIcon,
  FloppyDiskIcon,
  SettingsIcon,
  LogoutSquare01Icon,
} from "@hugeicons/core-free-icons";

const commands = [
  {
    icon: <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />,
    label: "Search",
    shortcut: "⌘K",
  },
  {
    icon: <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />,
    label: "New File",
    shortcut: "⌘N",
  },
  {
    icon: <HugeiconsIcon icon={FloppyDiskIcon} strokeWidth={2} />,
    label: "Save",
    shortcut: "⌘S",
  },
  {
    icon: <HugeiconsIcon icon={SettingsIcon} strokeWidth={2} />,
    label: "Settings",
    shortcut: "⌘,",
  },
  {
    icon: <HugeiconsIcon icon={LogoutSquare01Icon} strokeWidth={2} />,
    label: "Sign Out",
    shortcut: "⌘Q",
  },
];

export function Pattern() {
  return (
    <div className="mx-auto flex w-full max-w-64 flex-col gap-0.5">
      {commands.map((cmd) => (
        <Item key={cmd.label} asChild size="xs">
          <a href="#">
            <ItemMedia variant="icon">{cmd.icon}</ItemMedia>
            <ItemContent>
              <ItemTitle>{cmd.label}</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Kbd>{cmd.shortcut}</Kbd>
            </ItemActions>
          </a>
        </Item>
      ))}
    </div>
  );
}

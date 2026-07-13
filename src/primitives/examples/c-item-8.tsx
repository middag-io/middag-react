import { Badge } from "@/primitives/reui/badge";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/primitives/reui/item";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  InboxIcon,
  SentIcon,
  FileEmpty02Icon,
  Archive02Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";

const menuItems = [
  {
    icon: <HugeiconsIcon icon={InboxIcon} strokeWidth={2} />,
    label: "Inbox",
    count: 12,
  },
  {
    icon: <HugeiconsIcon icon={SentIcon} strokeWidth={2} />,
    label: "Sent",
    count: 0,
  },
  {
    icon: <HugeiconsIcon icon={FileEmpty02Icon} strokeWidth={2} />,
    label: "Drafts",
    count: 3,
  },
  {
    icon: <HugeiconsIcon icon={Archive02Icon} strokeWidth={2} />,
    label: "Archive",
    count: 0,
  },
  {
    icon: <HugeiconsIcon icon={Delete02Icon} strokeWidth={2} />,
    label: "Trash",
    count: 0,
  },
];

export function Pattern() {
  return (
    <div className="mx-auto flex w-full max-w-64 flex-col gap-0.5">
      {menuItems.map((item) => (
        <Item key={item.label} size="xs" asChild>
          <a href="#">
            <ItemMedia variant="icon">{item.icon}</ItemMedia>
            <ItemContent>
              <ItemTitle>{item.label}</ItemTitle>
            </ItemContent>
            {item.count > 1 && (
              <ItemActions>
                <Badge
                  variant="success-light"
                  className="rounded-full"
                  size="xs"
                >
                  {item.count}
                </Badge>
              </ItemActions>
            )}
          </a>
        </Item>
      ))}
    </div>
  );
}

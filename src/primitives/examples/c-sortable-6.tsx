import { ReactNode, useState } from "react";
import { Badge } from "@/primitives/reui/badge";
import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/primitives/reui/frame";
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from "@/primitives/reui/sortable";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare02Icon,
  InboxIcon,
  FolderIcon,
  Calendar04Icon,
  ChartBarLineIcon,
  SettingsIcon,
  DragDropVerticalIcon,
} from "@hugeicons/core-free-icons";

interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
  count?: number;
}

const defaultItems: NavItem[] = [
  {
    id: "1",
    label: "Dashboard",
    icon: (
      <HugeiconsIcon
        icon={DashboardSquare02Icon}
        strokeWidth={2}
        className="text-muted-foreground size-4"
      />
    ),
  },
  {
    id: "2",
    label: "Inbox",
    icon: (
      <HugeiconsIcon
        icon={InboxIcon}
        strokeWidth={2}
        className="text-muted-foreground size-4"
      />
    ),
    count: 5,
  },
  {
    id: "3",
    label: "Projects",
    icon: (
      <HugeiconsIcon
        icon={FolderIcon}
        strokeWidth={2}
        className="text-muted-foreground size-4"
      />
    ),
    count: 12,
  },
  {
    id: "4",
    label: "Calendar",
    icon: (
      <HugeiconsIcon
        icon={Calendar04Icon}
        strokeWidth={2}
        className="text-muted-foreground size-4"
      />
    ),
  },
  {
    id: "5",
    label: "Analytics",
    icon: (
      <HugeiconsIcon
        icon={ChartBarLineIcon}
        strokeWidth={2}
        className="text-muted-foreground size-4"
      />
    ),
  },
  {
    id: "6",
    label: "Settings",
    icon: (
      <HugeiconsIcon
        icon={SettingsIcon}
        strokeWidth={2}
        className="text-muted-foreground size-4"
      />
    ),
  },
];

export function Pattern() {
  const [items, setItems] = useState<NavItem[]>(defaultItems);

  return (
    <div className="mx-auto w-full max-w-xs">
      <Frame spacing="xs">
        <FrameHeader>
          <FrameTitle>Navigation</FrameTitle>
        </FrameHeader>
        <FramePanel className="p-2!">
          <Sortable
            value={items}
            onValueChange={setItems}
            getItemValue={(item) => item.id}
            strategy="vertical"
            className="space-y-0.5"
          >
            {items.map((item) => (
              <SortableItem key={item.id} value={item.id}>
                <div className="hover:bg-accent flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors">
                  <SortableItemHandle className="text-muted-foreground hover:text-foreground opacity-0 transition-opacity group-hover:opacity-100 [div:hover>&]:opacity-100">
                    <HugeiconsIcon
                      icon={DragDropVerticalIcon}
                      strokeWidth={2}
                      className="size-3.5"
                    />
                  </SortableItemHandle>
                  {item.icon}
                  <span className="flex-1 text-sm">{item.label}</span>
                  {item.count && (
                    <Badge variant="outline" size="sm" className="rounded-full">
                      {item.count}
                    </Badge>
                  )}
                </div>
              </SortableItem>
            ))}
          </Sortable>
        </FramePanel>
      </Frame>
    </div>
  );
}

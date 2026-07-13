import { ReactElement, useState } from "react";

import { Card, CardContent } from "@/primitives/reui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/primitives/reui/collapsible";
import { Item, ItemMedia, ItemTitle } from "@/primitives/reui/item";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare02Icon,
  BarChartHorizontalIcon,
  File02Icon,
  Message02Icon,
  UserIcon,
  Shield01Icon,
  CreditCardIcon,
  SettingsIcon,
  NotificationIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";

type NavItem = {
  id: string;
  name: string;
  icon: ReactElement;
  items?: NavItem[];
};

const navItems: NavItem[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: <HugeiconsIcon icon={DashboardSquare02Icon} strokeWidth={2} />,
    items: [
      {
        id: "analytics",
        name: "Analytics",
        icon: <HugeiconsIcon icon={BarChartHorizontalIcon} strokeWidth={2} />,
        items: [
          {
            id: "real-time",
            name: "Real-time",
            icon: (
              <HugeiconsIcon
                icon={File02Icon}
                strokeWidth={2}
                aria-hidden="true"
              />
            ),
          },
          {
            id: "historical",
            name: "Historical",
            icon: (
              <HugeiconsIcon
                icon={File02Icon}
                strokeWidth={2}
                aria-hidden="true"
              />
            ),
          },
        ],
      },
      {
        id: "reports",
        name: "Reports",
        icon: (
          <HugeiconsIcon
            icon={Message02Icon}
            strokeWidth={2}
            aria-hidden="true"
          />
        ),
      },
    ],
  },
  {
    id: "team",
    name: "Team",
    icon: <HugeiconsIcon icon={UserIcon} strokeWidth={2} aria-hidden="true" />,
    items: [
      {
        id: "members",
        name: "Members",
        icon: (
          <HugeiconsIcon icon={UserIcon} strokeWidth={2} aria-hidden="true" />
        ),
      },
      {
        id: "permissions",
        name: "Permissions",
        icon: (
          <HugeiconsIcon
            icon={Shield01Icon}
            strokeWidth={2}
            aria-hidden="true"
          />
        ),
      },
    ],
  },
  {
    id: "billing",
    name: "Billing",
    icon: (
      <HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} aria-hidden="true" />
    ),
  },
  {
    id: "settings",
    name: "Settings",
    icon: (
      <HugeiconsIcon icon={SettingsIcon} strokeWidth={2} aria-hidden="true" />
    ),
  },
  {
    id: "notifications",
    name: "Notifications",
    icon: (
      <HugeiconsIcon
        icon={NotificationIcon}
        strokeWidth={2}
        aria-hidden="true"
      />
    ),
  },
];

function NavMenuItem({
  item,
  level = 0,
  selectedId,
  onSelect,
}: {
  item: NavItem;
  level?: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const isFolder = !!item.items && item.items.length > 0;
  const isSelected = selectedId === item.id;

  if (isFolder) {
    return (
      <Collapsible className="group/collapsible">
        <CollapsibleTrigger asChild>
          <Item
            size="xs"
            className="hover:bg-accent data-[state=open]:bg-accent group/item cursor-pointer py-1.25"
            style={{ paddingLeft: `${level * 12 + 8}px` }}
          >
            <ItemMedia variant="icon">
              <div className="text-muted-foreground group-hover/item:text-foreground size-3.5">
                {item.icon}
              </div>
            </ItemMedia>
            <ItemTitle className="data-[state=open]/collapsible:font-semibold text-sm">
              {item.name}
            </ItemTitle>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              strokeWidth={2}
              aria-hidden="true"
              className="text-muted-foreground ml-auto size-4 transition-transform in-data-[state=open]:rotate-90"
            />
          </Item>
        </CollapsibleTrigger>
        <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden pt-0.5">
          <div className="flex flex-col gap-0.5">
            {item.items?.map((child) => (
              <NavMenuItem
                key={child.id}
                item={child}
                level={level + 1}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Item
      size="xs"
      className="hover:bg-accent data-[active=true]:bg-accent data-[active=true]:text-foreground group/item cursor-pointer py-1.25"
      data-active={isSelected}
      style={{ paddingLeft: `${level * 12 + 8}px` }}
      onClick={() => onSelect(item.id)}
    >
      <ItemMedia variant="icon">
        <div className="text-muted-foreground group-hover/item:text-foreground group-data-[active=true]/item:text-foreground size-3.5">
          {item.icon}
        </div>
      </ItemMedia>
      <ItemTitle className="text-sm">{item.name}</ItemTitle>
    </Item>
  );
}

export function Pattern() {
  const [selectedId, setSelectedId] = useState<string | null>("real-time");

  return (
    <div className="min-h-64 w-full max-w-56">
      <Card className="p-0">
        <CardContent className="p-1">
          <div className="gap-0/5 flex flex-col">
            {navItems.map((item) => (
              <NavMenuItem
                key={item.id}
                item={item}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

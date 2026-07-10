"use client";

import { ReactElement } from "react";

import { Field } from "@/primitives/reui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/primitives/reui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ScanIcon,
  DashboardSquare02Icon,
  ActivityIcon,
  Shield01Icon,
  SettingsIcon,
} from "@hugeicons/core-free-icons";

interface IconPlaceholderProps {
  lucide: string;
  tabler: string;
  hugeicons: string;
  phosphor: string;
  remixicon: string;
  className?: string;
}

interface Item {
  label: string;
  value: string | null;
  icon: ReactElement<IconPlaceholderProps>;
}

const items: Item[] = [
  {
    label: "Select an option",
    value: null,
    icon: (
      <HugeiconsIcon
        icon={ScanIcon}
        strokeWidth={2}
        className="text-muted-foreground size-4"
      />
    ),
  },
  {
    label: "Dashboard",
    value: "dashboard",
    icon: (
      <HugeiconsIcon
        icon={DashboardSquare02Icon}
        strokeWidth={2}
        className="text-muted-foreground size-4"
      />
    ),
  },
  {
    label: "Activity",
    value: "activity",
    icon: (
      <HugeiconsIcon
        icon={ActivityIcon}
        strokeWidth={2}
        className="text-muted-foreground size-4"
      />
    ),
  },
  {
    label: "Security",
    value: "security",
    icon: (
      <HugeiconsIcon
        icon={Shield01Icon}
        strokeWidth={2}
        className="text-muted-foreground size-4"
      />
    ),
  },
  {
    label: "Settings",
    value: "settings",
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
  return (
    <Field className="max-w-xs">
      <Select>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {items.slice(1).map((item) => (
              <SelectItem key={item.value} value={item.value!}>
                {item.icon}
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}

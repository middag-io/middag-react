"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/primitives/reui/button";
import { ButtonGroup } from "@/primitives/reui/button-group";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  BarChartIcon,
  Settings01Icon,
  HelpCircleIcon,
} from "@hugeicons/core-free-icons";

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <HugeiconsIcon
        icon={DashboardSquare01Icon}
        strokeWidth={2}
        aria-hidden="true"
      />
    ),
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: (
      <HugeiconsIcon icon={BarChartIcon} strokeWidth={2} aria-hidden="true" />
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <HugeiconsIcon icon={Settings01Icon} strokeWidth={2} aria-hidden="true" />
    ),
  },
  {
    id: "help",
    label: "Help",
    icon: (
      <HugeiconsIcon icon={HelpCircleIcon} strokeWidth={2} aria-hidden="true" />
    ),
  },
];

export function Pattern() {
  const [active, setActive] = useState("dashboard");

  return (
    <ButtonGroup orientation="vertical">
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant="outline"
          className={cn("justify-start", active === item.id ? "bg-muted" : "")}
          onClick={() => setActive(item.id)}
        >
          {item.icon}
          {item.label}
        </Button>
      ))}
    </ButtonGroup>
  );
}

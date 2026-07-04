"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/reui/button";
import { ButtonGroup } from "@/components/reui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/reui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Route01Icon,
  EaseCurveControlPointsIcon,
  RoboticIcon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";

const items = [
  {
    id: "Routes",
    label: "Routes",
    icon: (
      <HugeiconsIcon
        icon={Route01Icon}
        strokeWidth={2}
        aria-hidden="true"
        className="size-3.5 opacity-60"
      />
    ),
  },
  {
    id: "Paths",
    label: "Paths",
    icon: (
      <HugeiconsIcon
        icon={EaseCurveControlPointsIcon}
        strokeWidth={2}
        aria-hidden="true"
        className="size-3.5 opacity-60"
      />
    ),
  },
  {
    id: "Bot Name",
    label: "Bot Name",
    icon: (
      <HugeiconsIcon
        icon={RoboticIcon}
        strokeWidth={2}
        aria-hidden="true"
        className="size-3.5 opacity-60"
      />
    ),
  },
];

export function Pattern() {
  const [active, setActive] = useState("Paths");

  return (
    <ButtonGroup>
      {items.map((item) => (
        <Button
          key={item.id}
          variant="outline"
          className={cn(active === item.id ? "bg-muted" : "")}
          onClick={() => setActive(item.id)}
        >
          {item.icon}
          {item.label}
        </Button>
      ))}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={2}
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuItem>Filter by Group</DropdownMenuItem>
          <DropdownMenuItem>Sort by Name</DropdownMenuItem>
          <DropdownMenuItem>Export Data</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}

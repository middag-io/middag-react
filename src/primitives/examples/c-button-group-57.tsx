"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/primitives/reui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/primitives/reui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/primitives/reui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Message02Icon,
  ShieldEnergyIcon,
  LightningIcon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";

const modes = [
  {
    id: "assist",
    label: "Assist",
    icon: (
      <HugeiconsIcon
        icon={Message02Icon}
        strokeWidth={2}
        className="size-3.5 opacity-60"
        aria-hidden="true"
      />
    ),
  },
  {
    id: "review",
    label: "Review",
    icon: (
      <HugeiconsIcon
        icon={ShieldEnergyIcon}
        strokeWidth={2}
        className="size-3.5 opacity-60"
        aria-hidden="true"
      />
    ),
  },
  {
    id: "auto",
    label: "Auto",
    icon: (
      <HugeiconsIcon
        icon={LightningIcon}
        strokeWidth={2}
        className="size-3.5 opacity-60"
        aria-hidden="true"
      />
    ),
  },
] as const;

const limits = ["2k credits", "10k credits", "Unlimited"];

type ModeId = (typeof modes)[number]["id"];

export function Pattern() {
  const [active, setActive] = useState<ModeId>("review");
  const [limit, setLimit] = useState(limits[1]);

  return (
    <ButtonGroup>
      {modes.map((mode) => (
        <Button
          key={mode.id}
          variant="outline"
          size="sm"
          className={cn(active === mode.id && "bg-muted")}
          onClick={() => setActive(mode.id)}
        >
          {mode.icon}
          {mode.label}
        </Button>
      ))}
      <ButtonGroupSeparator />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            aria-label="Select credit cap"
          >
            {limit}
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={2}
              className="size-3 opacity-60"
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuGroup>
            {limits.map((item) => (
              <DropdownMenuItem key={item} onClick={() => setLimit(item)}>
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}

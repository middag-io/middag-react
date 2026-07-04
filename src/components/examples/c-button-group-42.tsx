"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/reui/button";
import { ButtonGroup } from "@/components/reui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/reui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  TrendUp01Icon,
  Target01Icon,
  SecurityPasswordIcon,
  SecurityCheckIcon,
} from "@hugeicons/core-free-icons";

const orderTypes = [
  {
    id: "market",
    label: "Market",
    tooltip: "Execute immediately at best available price",
    icon: (
      <HugeiconsIcon icon={TrendUp01Icon} strokeWidth={2} aria-hidden="true" />
    ),
  },
  {
    id: "limit",
    label: "Limit",
    tooltip: "Execute only at your specified price or better",
    icon: (
      <HugeiconsIcon icon={Target01Icon} strokeWidth={2} aria-hidden="true" />
    ),
  },
  {
    id: "stop",
    label: "Stop",
    tooltip: "Trigger a market order at stop level",
    icon: (
      <HugeiconsIcon
        icon={SecurityPasswordIcon}
        strokeWidth={2}
        aria-hidden="true"
      />
    ),
  },
  {
    id: "stop-limit",
    label: "Stop-Limit",
    tooltip: "Trigger a limit order at stop level",
    icon: (
      <HugeiconsIcon
        icon={SecurityCheckIcon}
        strokeWidth={2}
        aria-hidden="true"
      />
    ),
  },
];

export function Pattern() {
  const [active, setActive] = useState("market");

  return (
    <ButtonGroup>
      <TooltipProvider>
        {orderTypes.map((type) => (
          <Tooltip key={type.id}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className={cn(active === type.id ? "bg-muted" : "")}
                onClick={() => setActive(type.id)}
              >
                {type.icon}
                {type.label}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-52 text-center">
              {type.tooltip}
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </ButtonGroup>
  );
}

"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/primitives/reui/button";
import { ButtonGroup } from "@/primitives/reui/button-group";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ClockIcon,
  Calendar02Icon,
  Calendar03Icon,
  MagicWand01Icon,
} from "@hugeicons/core-free-icons";

const intervals = [
  {
    id: "1m",
    icon: <HugeiconsIcon icon={ClockIcon} strokeWidth={2} aria-hidden="true" />,
  },
  {
    id: "5m",
    icon: <HugeiconsIcon icon={ClockIcon} strokeWidth={2} aria-hidden="true" />,
  },
  {
    id: "1H",
    icon: <HugeiconsIcon icon={ClockIcon} strokeWidth={2} aria-hidden="true" />,
  },
  {
    id: "1D",
    icon: (
      <HugeiconsIcon icon={Calendar02Icon} strokeWidth={2} aria-hidden="true" />
    ),
  },
  {
    id: "1W",
    icon: (
      <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} aria-hidden="true" />
    ),
  },
  {
    id: "Auto",
    icon: (
      <HugeiconsIcon
        icon={MagicWand01Icon}
        strokeWidth={2}
        aria-hidden="true"
      />
    ),
  },
];

export function Pattern() {
  const [active, setActive] = useState("1H");

  return (
    <ButtonGroup>
      {intervals.map((interval) => (
        <Button
          key={interval.id}
          variant="outline"
          size="sm"
          className={cn(
            "h-7 gap-1.5 px-2.5 text-xs tabular-nums",
            active === interval.id ? "bg-muted" : "",
          )}
          onClick={() => setActive(interval.id)}
        >
          {interval.icon}
          {interval.id}
        </Button>
      ))}
    </ButtonGroup>
  );
}

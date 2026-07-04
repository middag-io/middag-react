"use client";

import { useState } from "react";

import { Button } from "@/components/reui/button";
import { ButtonGroup } from "@/components/reui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/reui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUpDown02Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";

const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won"];

const icons = {
  prev: (
    <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} aria-hidden="true" />
  ),
  next: (
    <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} aria-hidden="true" />
  ),
  chevronsUpDown: (
    <HugeiconsIcon
      icon={ArrowUpDown02Icon}
      strokeWidth={2}
      aria-hidden="true"
      className="size-3.5 shrink-0 opacity-50"
    />
  ),
  check: (
    <HugeiconsIcon
      icon={Tick02Icon}
      strokeWidth={2}
      aria-hidden="true"
      className="text-primary ml-auto size-3.5"
    />
  ),
};

export function Pattern() {
  const [stageIndex, setStageIndex] = useState(2);

  return (
    <ButtonGroup>
      <Button
        variant="outline"
        size="icon"
        aria-label="Previous stage"
        disabled={stageIndex === 0}
        onClick={() => setStageIndex((i) => i - 1)}
      >
        {icons.prev}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="min-w-36 justify-between">
            <span className="truncate">{stages[stageIndex]}</span>
            {icons.chevronsUpDown}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Jump to stage</DropdownMenuLabel>
            {stages.map((stage, i) => (
              <DropdownMenuItem key={stage} onClick={() => setStageIndex(i)}>
                {stage}
                {i === stageIndex ? icons.check : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        size="icon"
        aria-label="Next stage"
        disabled={stageIndex === stages.length - 1}
        onClick={() => setStageIndex((i) => i + 1)}
      >
        {icons.next}
      </Button>
    </ButtonGroup>
  );
}

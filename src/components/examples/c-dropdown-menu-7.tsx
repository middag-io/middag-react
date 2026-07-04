"use client";

import { useState } from "react";

import { Button } from "@/components/reui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/reui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUp02Icon,
  ArrowDown02Icon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  const [position, setPosition] = useState("bottom");

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-fit">
            Radio Group
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={position}
              onValueChange={setPosition}
            >
              <DropdownMenuRadioItem value="top">
                <HugeiconsIcon icon={ArrowUp02Icon} strokeWidth={2} />
                Top
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bottom">
                <HugeiconsIcon icon={ArrowDown02Icon} strokeWidth={2} />
                Bottom
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="right" disabled>
                <HugeiconsIcon icon={ArrowRight02Icon} strokeWidth={2} />
                Right
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

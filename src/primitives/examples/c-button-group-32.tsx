"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/primitives/reui/button";
import { ButtonGroup } from "@/primitives/reui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/primitives/reui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FilterMailIcon,
  GridViewIcon,
  Menu01Icon,
  ArrowDown01Icon,
  PlusSignIcon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  const [view, setView] = useState<"grid" | "list">("list");

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Sort">
            <HugeiconsIcon
              icon={FilterMailIcon}
              strokeWidth={2}
              className="..."
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-40">
          <DropdownMenuItem>Newest</DropdownMenuItem>
          <DropdownMenuItem>Oldest</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Recently Updated</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ButtonGroup>
        <Button
          variant="outline"
          size="icon"
          className={cn(view === "grid" && "bg-muted")}
          onClick={() => setView("grid")}
          aria-label="Grid view"
        >
          <HugeiconsIcon
            icon={GridViewIcon}
            strokeWidth={2}
            aria-hidden="true"
          />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className={cn(view === "list" && "bg-muted")}
          onClick={() => setView("list")}
          aria-label="List view"
        >
          <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} aria-hidden="true" />
        </Button>
      </ButtonGroup>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            Add New...
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={2}
              aria-hidden="true"
              className="opacity-60"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuItem>
            <HugeiconsIcon
              icon={PlusSignIcon}
              strokeWidth={2}
              aria-hidden="true"
            />
            Project
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HugeiconsIcon
              icon={PlusSignIcon}
              strokeWidth={2}
              aria-hidden="true"
            />
            Domain
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <HugeiconsIcon
              icon={PlusSignIcon}
              strokeWidth={2}
              aria-hidden="true"
            />
            Team
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

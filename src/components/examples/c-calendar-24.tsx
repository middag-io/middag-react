"use client";

import { useId, useState } from "react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/reui/button";
import { Calendar } from "@/components/reui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/reui/popover";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar04Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  const id = useId();
  const [date, setDate] = useState<Date | undefined>();

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          className="group/pick-date w-60 justify-between"
          id={id}
          variant="outline"
        >
          <span className={cn("truncate", !date && "text-muted-foreground")}>
            {date ? format(date, "PPP") : "Pick a date"}
          </span>
          <HugeiconsIcon
            icon={Calendar04Icon}
            strokeWidth={2}
            aria-hidden="true"
            className="opacity-60 transition-opacity group-hover/pick-date:opacity-100"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar mode="single" onSelect={setDate} selected={date} />
      </PopoverContent>
    </Popover>
  );
}

"use client";

import { useState } from "react";

import { Field } from "@/components/reui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/reui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MultiplicationSignIcon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";

const items = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Blueberry", value: "blueberry" },
  { label: "Grapes", value: "grapes" },
  { label: "Pineapple", value: "pineapple" },
  { label: "Strawberry", value: "strawberry" },
];

export function Pattern() {
  const [value, setValue] = useState("");

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setValue("");
  };

  return (
    <Field className="max-w-xs">
      <Select key={value || "__empty__"} value={value} onValueChange={setValue}>
        <SelectTrigger className="w-[200px] [&>svg:last-child]:hidden!">
          <SelectValue placeholder="Select an option" />
          {value !== "" ? (
            <div
              role="button"
              tabIndex={-1}
              onClick={handleClear}
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="text-muted-foreground hover:text-foreground flex size-4 items-center justify-center rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
            >
              <HugeiconsIcon
                icon={MultiplicationSignIcon}
                strokeWidth={2}
                className="size-4"
              />
              <span className="sr-only">Clear selection</span>
            </div>
          ) : (
            <HugeiconsIcon
              icon={UnfoldMoreIcon}
              strokeWidth={2}
              className="text-muted-foreground size-4"
            />
          )}
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}

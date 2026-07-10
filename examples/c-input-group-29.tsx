"use client";

import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/reui/dropdown-menu";
import { Field } from "@/components/reui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/reui/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  const [category, setCategory] = useState("Category");

  return (
    <Field className="max-w-xs">
      <InputGroup className="rounded-full">
        <InputGroupInput
          placeholder="Search products"
          className="rounded-full px-5"
        />
        <InputGroupAddon align="inline-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                variant="ghost"
                className="h-7 rounded-full px-3 text-xs"
              >
                {category}
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  strokeWidth={2}
                  className="ml-1 size-3.5 opacity-60"
                />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-32">
              <DropdownMenuItem onClick={() => setCategory("Electronics")}>
                Electronics
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategory("Clothing")}>
                Clothing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategory("Home")}>
                Home
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

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
  InputGroupTextarea,
} from "@/components/reui/input-group";
import { Kbd } from "@/components/reui/kbd";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PlusSignIcon,
  Mic02Icon,
  Globe02Icon,
  ArrowDown01Icon,
  ArrowUp02Icon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  const [model, setModel] = useState("GPT-4o");

  return (
    <Field className="max-w-xs">
      <InputGroup>
        <InputGroupTextarea
          placeholder="Ask AI anything..."
          className="min-h-24 pb-12"
        />
        <InputGroupAddon align="block-end">
          <div className="flex items-center gap-1">
            <InputGroupButton variant="ghost" size="icon-xs">
              <HugeiconsIcon
                icon={PlusSignIcon}
                strokeWidth={2}
                className="size-4"
              />
            </InputGroupButton>
            <InputGroupButton variant="ghost" size="icon-xs">
              <HugeiconsIcon
                icon={Mic02Icon}
                strokeWidth={2}
                className="size-4"
              />
            </InputGroupButton>
            <InputGroupButton variant="ghost" className="h-7 px-2 text-xs">
              <HugeiconsIcon
                icon={Globe02Icon}
                strokeWidth={2}
                className="mr-1 size-3.5"
              />
              Search
            </InputGroupButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InputGroupButton variant="ghost" className="h-7 px-2 text-xs">
                  <Kbd className="border-border rounded-sm border">Σ</Kbd>
                  {model}
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    strokeWidth={2}
                    className="ml-1 size-3.5 opacity-60"
                  />
                </InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-32">
                <DropdownMenuItem onClick={() => setModel("GPT-4o")}>
                  GPT-4o
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setModel("GPT-4")}>
                  GPT-4
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setModel("Claude 3.5")}>
                  Claude 3.5
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <InputGroupButton
            variant="default"
            size="icon-xs"
            className="ml-auto"
          >
            <HugeiconsIcon
              icon={ArrowUp02Icon}
              strokeWidth={2}
              className="size-4"
            />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

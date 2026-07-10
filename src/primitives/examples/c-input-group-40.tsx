"use client";

import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/primitives/reui/dropdown-menu";
import { Field } from "@/primitives/reui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/primitives/reui/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Link01Icon,
  ArrowDown01Icon,
  CopyIcon,
} from "@hugeicons/core-free-icons";

const visibilityOptions = ["Private", "Team", "Public"];

export function Pattern() {
  const [visibility, setVisibility] = useState(visibilityOptions[0]);

  return (
    <Field className="max-w-sm">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <HugeiconsIcon
            icon={Link01Icon}
            strokeWidth={2}
            className="size-4 opacity-60"
            aria-hidden="true"
          />
        </InputGroupAddon>

        <InputGroupInput
          defaultValue="agentflow.ai/runbooks/q2-review"
          aria-label="Share link"
        />

        <InputGroupAddon align="inline-end" className="gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                variant="ghost"
                size="xs"
                className="gap-1.5"
                aria-label="Select visibility"
              >
                {visibility}
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  strokeWidth={2}
                  className="size-3 opacity-60"
                  aria-hidden="true"
                />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-28">
              <DropdownMenuGroup>
                {visibilityOptions.map((item) => (
                  <DropdownMenuItem
                    key={item}
                    onSelect={() => setVisibility(item)}
                  >
                    {item}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <InputGroupButton
            variant="ghost"
            size="icon-xs"
            aria-label="Copy link"
          >
            <HugeiconsIcon icon={CopyIcon} strokeWidth={2} aria-hidden="true" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

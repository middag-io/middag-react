"use client";

import type { ReactNode } from "react";

import { ClaudeAiIcon } from "@/primitives/ui/svgs/claudeAiIcon";
import { Gemini } from "@/primitives/ui/svgs/gemini";
import { Openai } from "@/primitives/ui/svgs/openai";
import { OpenaiDark } from "@/primitives/ui/svgs/openaiDark";
import { Button } from "@/primitives/reui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/primitives/reui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

interface MenuItem {
  id: string;
  label: string;
  logo: ReactNode;
  logoDark?: ReactNode;
}

const menuItems: Array<MenuItem> = [
  {
    id: "gpt4o",
    label: "GPT-5.4",
    logo: <Openai />,
    logoDark: <OpenaiDark />,
  },
  {
    id: "claude",
    label: "Claude 4.6 Opus",
    logo: <ClaudeAiIcon />,
  },
  { id: "gemini", label: "Gemini 3.1 Pro", logo: <Gemini /> },
];

export function Pattern() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="w-36">
          Select model
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            strokeWidth={2}
            className="ml-auto"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Model</DropdownMenuLabel>
          {menuItems.map((item) => (
            <DropdownMenuItem key={item.id}>
              {item.logoDark ? (
                <>
                  <span aria-hidden className="dark:hidden">
                    {item.logo}
                  </span>
                  <span aria-hidden className="hidden dark:block">
                    {item.logoDark}
                  </span>
                </>
              ) : (
                item.logo
              )}
              <span>{item.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

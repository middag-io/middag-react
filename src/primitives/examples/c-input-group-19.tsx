import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/primitives/reui/dropdown-menu";
import { Field } from "@/primitives/reui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/primitives/reui/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AtIcon,
  Attachment02Icon,
  File02Icon,
  ArrowDown01Icon,
  ImageIcon,
  ArrowMoveDownLeftIcon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  const [model, setModel] = useState("GPT-4o");

  return (
    <Field className="max-w-xs">
      <InputGroup className="bg-background">
        <InputGroupAddon align="block-start" className="gap-2 px-3 pt-3">
          <InputGroupButton variant="outline" size="icon-xs">
            <HugeiconsIcon icon={AtIcon} strokeWidth={2} className="size-3.5" />
          </InputGroupButton>
          <InputGroupButton variant="outline">
            <HugeiconsIcon
              icon={Attachment02Icon}
              strokeWidth={2}
              className="size-3.5 not-only:rotate-45"
            />
            1
          </InputGroupButton>
          <InputGroupButton variant="outline">
            <HugeiconsIcon
              icon={File02Icon}
              strokeWidth={2}
              className="size-3.5 not-only:rotate-45"
            />
            1 Tab
          </InputGroupButton>
        </InputGroupAddon>

        <InputGroupTextarea
          placeholder="Plan, search, build anything"
          className="min-h-24 border-none py-4 shadow-none focus-visible:ring-0"
        />

        <InputGroupAddon align="block-end" className="px-3 pb-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton variant="secondary" size="sm">
                {model}
                <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setModel("GPT-4o")}>
                GPT-4o
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setModel("Claude 3.5 Sonnet")}>
                Claude 3.5 Sonnet
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="ml-auto flex items-center gap-2">
            <InputGroupButton variant="secondary" size="icon-sm">
              <HugeiconsIcon
                icon={ImageIcon}
                strokeWidth={2}
                className="text-muted-foreground"
              />
            </InputGroupButton>
            <InputGroupButton variant="default" size="icon-sm">
              <HugeiconsIcon icon={ArrowMoveDownLeftIcon} strokeWidth={2} />
            </InputGroupButton>
          </div>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

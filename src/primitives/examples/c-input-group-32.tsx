import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/primitives/reui/avatar";
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
  InputGroupInput,
} from "@/primitives/reui/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

const roles = ["Admin", "Member", "Viewer"];

export function Pattern() {
  const [role, setRole] = useState("Admin");

  return (
    <Field className="max-w-xs">
      <InputGroup>
        <InputGroupAddon className="pr-1">
          <Avatar className="size-5">
            <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
        </InputGroupAddon>

        <InputGroupInput defaultValue="@shadcn" className="pl-1!" />

        <InputGroupAddon align="inline-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton variant="ghost" className="h-7 text-xs">
                {role}
                <HugeiconsIcon
                  icon={ArrowDown01Icon}
                  strokeWidth={2}
                  className="size-3.5 opacity-60"
                />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-32">
              {roles.map((r) => (
                <DropdownMenuItem key={r} onClick={() => setRole(r)}>
                  {r}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

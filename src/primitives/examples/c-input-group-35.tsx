import { useState } from "react";

import { Field } from "@/primitives/reui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/primitives/reui/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SquareLock01Icon,
  ViewOffSlashIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Field className="max-w-xs">
      <InputGroup>
        <InputGroupAddon>
          <HugeiconsIcon
            icon={SquareLock01Icon}
            strokeWidth={2}
            className="text-muted-foreground size-4"
          />
        </InputGroupAddon>
        <InputGroupInput
          type={showPassword ? "text" : "password"}
          placeholder="Enter password"
        />
        <InputGroupButton
          variant="ghost"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <HugeiconsIcon
              icon={ViewOffSlashIcon}
              strokeWidth={2}
              className="text-muted-foreground size-4"
            />
          ) : (
            <HugeiconsIcon
              icon={ViewIcon}
              strokeWidth={2}
              className="text-muted-foreground size-4"
            />
          )}
        </InputGroupButton>
      </InputGroup>
    </Field>
  );
}

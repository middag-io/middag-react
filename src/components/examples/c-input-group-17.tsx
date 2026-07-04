import { useState } from "react";

import { Field } from "@/components/reui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/reui/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  const [value, setValue] = useState("");
  const maxLength = 140;

  return (
    <Field className="max-w-xs">
      <InputGroup>
        <InputGroupTextarea
          placeholder="Description..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          maxLength={maxLength}
          className="min-h-16 pb-12"
        />
        <InputGroupAddon align="block-end">
          <InputGroupText className="text-muted-foreground text-xs">
            {value.length}/{maxLength} characters
          </InputGroupText>
          <HugeiconsIcon
            icon={InformationCircleIcon}
            strokeWidth={2}
            className="text-muted-foreground ml-auto"
          />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

import { Field, FieldLabel } from "@/primitives/reui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/primitives/reui/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="search-input">Search Components</FieldLabel>
      <InputGroup>
        <InputGroupAddon>
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            className="text-muted-foreground"
          />
        </InputGroupAddon>
        <InputGroupInput id="search-input" placeholder="Search..." />
      </InputGroup>
    </Field>
  );
}

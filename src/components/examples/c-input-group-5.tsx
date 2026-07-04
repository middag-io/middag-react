import { Field } from "@/components/reui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/reui/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { MailIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Field className="max-w-xs">
      <InputGroup>
        <InputGroupInput type="email" placeholder="you@example.com" />
        <InputGroupAddon align="inline-end">
          <HugeiconsIcon icon={MailIcon} strokeWidth={2} />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

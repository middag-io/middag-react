import { Field } from "@/components/reui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/reui/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Field className="w-full max-w-xs">
      <InputGroup className="h-auto">
        <InputGroupInput placeholder="First name" />
        <InputGroupAddon align="block-start">
          <InputGroupText className="font-medium">User Profile</InputGroupText>
          <HugeiconsIcon
            icon={InformationCircleIcon}
            strokeWidth={2}
            className="ml-auto"
          />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

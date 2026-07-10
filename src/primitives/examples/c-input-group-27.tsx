import { ButtonGroup, ButtonGroupText } from "@/primitives/reui/button-group";
import { Field } from "@/primitives/reui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/primitives/reui/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Field className="max-w-xs">
      <ButtonGroup>
        <ButtonGroupText>https://</ButtonGroupText>
        <InputGroup>
          <InputGroupInput placeholder="example" />
          <InputGroupAddon align="inline-end">
            <HugeiconsIcon
              icon={InformationCircleIcon}
              strokeWidth={2}
              className="text-muted-foreground size-4"
            />
          </InputGroupAddon>
        </InputGroup>
        <ButtonGroupText>.com</ButtonGroupText>
      </ButtonGroup>
    </Field>
  );
}

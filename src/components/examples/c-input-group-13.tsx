import { Field } from "@/components/reui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/reui/input-group";
import { Kbd } from "@/components/reui/kbd";

export function Pattern() {
  return (
    <Field className="w-full max-w-xs">
      <InputGroup>
        <InputGroupInput placeholder="Search documentation..." />
        <InputGroupAddon align="inline-end">
          <Kbd>⌘K</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

import { Field } from "@/primitives/reui/field";
import { InputGroup, InputGroupInput } from "@/primitives/reui/input-group";

export function Pattern() {
  return (
    <Field className="max-w-xs" data-disabled="true">
      <InputGroup>
        <InputGroupInput placeholder="Disabled field" disabled />
      </InputGroup>
    </Field>
  );
}

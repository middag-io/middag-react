import { Field } from "@/primitives/reui/field";
import { InputGroup, InputGroupInput } from "@/primitives/reui/input-group";

export function Pattern() {
  return (
    <Field className="max-w-xs">
      <InputGroup>
        <InputGroupInput placeholder="Search..." />
      </InputGroup>
    </Field>
  );
}

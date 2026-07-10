import { Field } from "@/primitives/reui/field";
import { InputGroup, InputGroupInput } from "@/primitives/reui/input-group";

export function Pattern() {
  return (
    <Field className="max-w-xs" data-invalid="true">
      <InputGroup>
        <InputGroupInput placeholder="Invalid field" aria-invalid="true" />
      </InputGroup>
    </Field>
  );
}

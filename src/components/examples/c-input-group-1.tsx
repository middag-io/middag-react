import { Field } from "@/components/reui/field";
import { InputGroup, InputGroupInput } from "@/components/reui/input-group";

export function Pattern() {
  return (
    <Field className="max-w-xs">
      <InputGroup>
        <InputGroupInput placeholder="Search..." />
      </InputGroup>
    </Field>
  );
}

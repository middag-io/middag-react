import { Checkbox } from "@/primitives/reui/checkbox";
import { Field, FieldLabel } from "@/primitives/reui/field";

export function Pattern() {
  return (
    <Field orientation="horizontal" className="w-auto">
      <Checkbox id="terms" />
      <FieldLabel htmlFor="terms">Basic checkbox</FieldLabel>
    </Field>
  );
}

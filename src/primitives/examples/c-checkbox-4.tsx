import { Checkbox } from "@/primitives/reui/checkbox";
import { Field, FieldLabel } from "@/primitives/reui/field";

export function Pattern() {
  return (
    <Field orientation="horizontal" className="w-auto">
      <Checkbox id="indeterminate" checked="indeterminate" />
      <FieldLabel htmlFor="indeterminate">Indeterminate state</FieldLabel>
    </Field>
  );
}

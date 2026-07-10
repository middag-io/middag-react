import { Checkbox } from "@/primitives/reui/checkbox";
import { Field, FieldLabel } from "@/primitives/reui/field";

export function Pattern() {
  return (
    <Field orientation="horizontal" data-disabled className="w-auto">
      <Checkbox id="disabled-2" disabled defaultChecked />
      <FieldLabel htmlFor="disabled-2">Disabled checkbox</FieldLabel>
    </Field>
  );
}

import { Checkbox } from "@/primitives/reui/checkbox";
import { Field, FieldLabel } from "@/primitives/reui/field";

export function Pattern() {
  return (
    <Field orientation="horizontal" className="w-auto" data-invalid>
      <Checkbox id="invalid" aria-invalid />
      <FieldLabel htmlFor="invalid">Invalid checkbox</FieldLabel>
    </Field>
  );
}

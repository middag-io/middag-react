import { Checkbox } from "@/components/reui/checkbox";
import { Field, FieldLabel } from "@/components/reui/field";

export function Pattern() {
  return (
    <Field orientation="horizontal" className="w-auto">
      <Checkbox id="terms" />
      <FieldLabel htmlFor="terms">Basic checkbox</FieldLabel>
    </Field>
  );
}

import { Field, FieldLabel } from "@/primitives/reui/field";
import { Input } from "@/primitives/reui/input";

export function Pattern() {
  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="input-demo-date">Date</FieldLabel>
      <Input id="input-demo-date" type="date" />
    </Field>
  );
}

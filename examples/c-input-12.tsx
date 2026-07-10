import { Field, FieldLabel } from "@/components/reui/field";
import { Input } from "@/components/reui/input";

export function Pattern() {
  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="input-demo-file">File</FieldLabel>
      <Input id="input-demo-file" type="file" />
    </Field>
  );
}

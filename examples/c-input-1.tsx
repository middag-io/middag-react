import { Field } from "@/components/reui/field";
import { Input } from "@/components/reui/input";

export function Pattern() {
  return (
    <Field className="max-w-xs">
      <Input id="basic-input" type="text" placeholder="Basic Input" />
    </Field>
  );
}

import { Field } from "@/primitives/reui/field";
import { Input } from "@/primitives/reui/input";

export function Pattern() {
  return (
    <Field className="max-w-xs">
      <Input id="basic-input" type="text" placeholder="Basic Input" />
    </Field>
  );
}

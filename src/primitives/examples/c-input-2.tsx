import { Field, FieldLabel } from "@/primitives/reui/field";
import { Input } from "@/primitives/reui/input";

export function Pattern() {
  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor="input-demo-email">Email</FieldLabel>
      <Input
        id="input-demo-email"
        type="email"
        placeholder="name@example.com"
      />
    </Field>
  );
}

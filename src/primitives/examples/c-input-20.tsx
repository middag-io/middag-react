import { Field, FieldLabel } from "@/primitives/reui/field";
import { Input } from "@/primitives/reui/input";

export function Pattern() {
  return (
    <Field orientation="horizontal" className="w-full max-w-xs">
      <FieldLabel htmlFor="horizontal-name" className="w-24">
        Name
      </FieldLabel>
      <Input id="horizontal-name" placeholder="John Doe" />
    </Field>
  );
}

import { Field, FieldError } from "@/primitives/reui/field";
import { Input } from "@/primitives/reui/input";
import { Label } from "@/primitives/reui/label";

export function Pattern() {
  return (
    <Field className="w-full max-w-xs" data-invalid="true">
      <Label htmlFor="label-error">Email</Label>
      <Input
        id="label-error"
        type="email"
        defaultValue="invalid-email"
        aria-invalid="true"
      />
      <FieldError>Please enter a valid email address</FieldError>
    </Field>
  );
}

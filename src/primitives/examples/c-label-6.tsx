import { Field } from "@/primitives/reui/field";
import { Input } from "@/primitives/reui/input";
import { Label } from "@/primitives/reui/label";

export function Pattern() {
  return (
    <Field className="w-full max-w-xs">
      <Label htmlFor="label-optional">
        Phone number
        <span className="text-muted-foreground">(optional)</span>
      </Label>
      <Input id="label-optional" type="tel" placeholder="+1 (555) 000-0000" />
    </Field>
  );
}

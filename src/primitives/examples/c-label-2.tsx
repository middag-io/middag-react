import { Checkbox } from "@/primitives/reui/checkbox";
import { Field } from "@/primitives/reui/field";
import { Label } from "@/primitives/reui/label";

export function Pattern() {
  return (
    <Field orientation="horizontal" className="mx-auto w-auto">
      <Checkbox id="label-demo-terms" />
      <Label htmlFor="label-demo-terms">Accept terms and conditions</Label>
    </Field>
  );
}

import { Checkbox } from "@/components/reui/checkbox";
import { Field } from "@/components/reui/field";
import { Label } from "@/components/reui/label";

export function Pattern() {
  return (
    <Field orientation="horizontal" className="mx-auto w-auto">
      <Checkbox id="label-demo-terms" />
      <Label htmlFor="label-demo-terms">Accept terms and conditions</Label>
    </Field>
  );
}

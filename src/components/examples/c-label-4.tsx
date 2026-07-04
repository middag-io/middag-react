import { Field } from "@/components/reui/field";
import { Input } from "@/components/reui/input";
import { Label } from "@/components/reui/label";

export function Pattern() {
  return (
    <Field data-disabled={true} className="w-full max-w-xs">
      <Label htmlFor="label-demo-disabled">Disabled Field</Label>
      <Input id="label-demo-disabled" placeholder="Disabled input…" disabled />
    </Field>
  );
}

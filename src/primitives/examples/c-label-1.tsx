import { Field } from "@/primitives/reui/field";
import { Input } from "@/primitives/reui/input";
import { Label } from "@/primitives/reui/label";

export function Pattern() {
  return (
    <Field className="w-full max-w-xs">
      <Label htmlFor="label-demo-username">Username</Label>
      <Input id="label-demo-username" placeholder="Enter your username…" />
    </Field>
  );
}

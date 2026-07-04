import { Field } from "@/components/reui/field";
import { Input } from "@/components/reui/input";
import { Label } from "@/components/reui/label";

export function Pattern() {
  return (
    <Field className="w-full max-w-xs">
      <Label htmlFor="label-demo-username">Username</Label>
      <Input id="label-demo-username" placeholder="Enter your username…" />
    </Field>
  );
}

import { Field } from "@/components/reui/field";
import { Input } from "@/components/reui/input";
import { Label } from "@/components/reui/label";

export function Pattern() {
  return (
    <Field className="w-full max-w-xs">
      <Label htmlFor="label-required">
        Email address
        <span className="text-destructive">*</span>
      </Label>
      <Input
        id="label-required"
        type="email"
        placeholder="you@example.com"
        required
      />
    </Field>
  );
}

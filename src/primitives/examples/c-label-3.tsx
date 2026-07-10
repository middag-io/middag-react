import { Field } from "@/primitives/reui/field";
import { Label } from "@/primitives/reui/label";
import { Textarea } from "@/primitives/reui/textarea";

export function Pattern() {
  return (
    <Field className="w-full max-w-xs">
      <Label htmlFor="label-demo-message">Message</Label>
      <Textarea id="label-demo-message" placeholder="Type your message here…" />
    </Field>
  );
}

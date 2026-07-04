import { Field } from "@/components/reui/field";
import { Label } from "@/components/reui/label";
import { Textarea } from "@/components/reui/textarea";

export function Pattern() {
  return (
    <Field className="w-full max-w-xs">
      <Label htmlFor="label-demo-message">Message</Label>
      <Textarea id="label-demo-message" placeholder="Type your message here…" />
    </Field>
  );
}

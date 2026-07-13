import { Field, FieldDescription, FieldLabel } from "@/primitives/reui/field";
import { Textarea } from "@/primitives/reui/textarea";

export function Pattern() {
  return (
    <div className="mx-auto w-full max-w-xs">
      <Field className="w-full">
        <FieldLabel htmlFor="textarea-with-desc">Feedback</FieldLabel>
        <Textarea
          id="textarea-with-desc"
          placeholder="Type your message here…"
          rows={6}
        />
        <FieldDescription>
          Type your message and press enter to send.
        </FieldDescription>
      </Field>
    </div>
  );
}

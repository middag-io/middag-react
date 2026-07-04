import { Field, FieldLabel } from "@/components/reui/field";
import { Textarea } from "@/components/reui/textarea";

export function Pattern() {
  return (
    <div className="mx-auto w-full max-w-xs">
      <Field className="w-full">
        <FieldLabel htmlFor="textarea-disabled">Message (Disabled)</FieldLabel>
        <Textarea
          id="textarea-disabled"
          placeholder="Type your message here…"
          disabled
        />
      </Field>
    </div>
  );
}

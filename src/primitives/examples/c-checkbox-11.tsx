import { Card } from "@/primitives/reui/card";
import { Checkbox } from "@/primitives/reui/checkbox";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/primitives/reui/field";
import { Separator } from "@/primitives/reui/separator";

export function Pattern() {
  return (
    <Card className="w-full max-w-xs p-0">
      <FieldGroup className="gap-0">
        <Field>
          <FieldLabel className="px-4 py-3">
            <Checkbox defaultChecked />
            <FieldTitle>Push notifications</FieldTitle>
          </FieldLabel>
        </Field>
        <Separator />
        <Field>
          <FieldLabel className="px-4 py-3">
            <Checkbox />
            <FieldTitle>Email notifications</FieldTitle>
          </FieldLabel>
        </Field>
        <Separator />
        <Field>
          <FieldLabel className="px-4 py-3">
            <Checkbox />
            <FieldTitle>SMS notifications</FieldTitle>
          </FieldLabel>
        </Field>
      </FieldGroup>
    </Card>
  );
}

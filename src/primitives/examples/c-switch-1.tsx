import { Field, FieldLabel } from "@/primitives/reui/field";
import { Switch } from "@/primitives/reui/switch";

export function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <Field orientation="horizontal">
        <Switch id="switch-basic" />
        <FieldLabel htmlFor="switch-basic">Airplane Mode</FieldLabel>
      </Field>
    </div>
  );
}

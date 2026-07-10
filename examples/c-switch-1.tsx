import { Field, FieldLabel } from "@/components/reui/field";
import { Switch } from "@/components/reui/switch";

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

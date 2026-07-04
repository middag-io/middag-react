import { Field } from "@/components/reui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/reui/input-group";
import { Spinner } from "@/components/reui/spinner";

export function Pattern() {
  return (
    <Field className="max-w-xs" data-disabled="true">
      <InputGroup>
        <InputGroupInput defaultValue="shadcn_ui" disabled />
        <InputGroupAddon align="inline-end">
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

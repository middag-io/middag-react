import { Field, FieldLabel } from "@/components/reui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/reui/input-group";
import { Spinner } from "@/components/reui/spinner";

export function Pattern() {
  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor="search-loading">Searching</FieldLabel>
      <InputGroup id="search-loading">
        <InputGroupInput placeholder="Search records…" />
        <InputGroupAddon>
          <Spinner className="size-4" />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

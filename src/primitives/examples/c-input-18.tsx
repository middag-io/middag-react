import { Badge } from "@/primitives/reui/badge";

import { Field, FieldLabel } from "@/primitives/reui/field";
import { Input } from "@/primitives/reui/input";

export function Pattern() {
  return (
    <Field className="max-w-xs">
      <div className="flex items-center justify-between gap-2">
        <FieldLabel htmlFor="middle-name">Middle Name</FieldLabel>
        <Badge variant="warning-outline" size="sm">
          Optional
        </Badge>
      </div>
      <Input id="middle-name" placeholder="Alexander" />
    </Field>
  );
}

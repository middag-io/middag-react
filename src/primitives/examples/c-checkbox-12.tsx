import { Card } from "@/primitives/reui/card";
import { Checkbox } from "@/primitives/reui/checkbox";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/primitives/reui/field";
import { Separator } from "@/primitives/reui/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LaptopIcon,
  MailIcon,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Card className="w-full max-w-xs p-0">
      <FieldGroup className="gap-0">
        <Field>
          <FieldLabel className="justify-between px-4 py-3">
            <FieldTitle className="flex items-center gap-2">
              <HugeiconsIcon
                icon={LaptopIcon}
                strokeWidth={2}
                aria-hidden="true"
                className="size-4 opacity-60"
              />
              Push notifications
            </FieldTitle>
            <Checkbox defaultChecked />
          </FieldLabel>
        </Field>
        <Separator />
        <Field>
          <FieldLabel className="justify-between px-4 py-3">
            <FieldTitle className="flex items-center gap-2">
              <HugeiconsIcon
                icon={MailIcon}
                strokeWidth={2}
                aria-hidden="true"
                className="size-4 opacity-60"
              />
              Email notifications
            </FieldTitle>
            <Checkbox />
          </FieldLabel>
        </Field>
        <Separator />
        <Field>
          <FieldLabel className="justify-between px-4 py-3">
            <FieldTitle className="flex items-center gap-2">
              <HugeiconsIcon
                icon={SmartPhone01Icon}
                strokeWidth={2}
                aria-hidden="true"
                className="size-4 opacity-60"
              />
              SMS notifications
            </FieldTitle>
            <Checkbox />
          </FieldLabel>
        </Field>
      </FieldGroup>
    </Card>
  );
}

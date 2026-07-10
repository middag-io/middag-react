import { Card } from "@/components/reui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/reui/field";
import { Separator } from "@/components/reui/separator";
import { Switch } from "@/components/reui/switch";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  NotificationIcon,
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
                icon={NotificationIcon}
                strokeWidth={2}
                aria-hidden="true"
                className="size-4 opacity-60"
              />
              Push notifications
            </FieldTitle>
            <Switch defaultChecked />
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
            <Switch />
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
            <Switch />
          </FieldLabel>
        </Field>
      </FieldGroup>
    </Card>
  );
}

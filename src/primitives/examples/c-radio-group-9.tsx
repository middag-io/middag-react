import { Card } from "@/primitives/reui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/primitives/reui/field";
import { RadioGroup, RadioGroupItem } from "@/primitives/reui/radio-group";
import { Separator } from "@/primitives/reui/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MailIcon,
  SmartPhone01Icon,
  Message02Icon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Card className="w-full max-w-xs p-0">
      <RadioGroup defaultValue="email">
        <FieldGroup className="gap-0">
          <Field>
            <FieldLabel className="justify-between px-4 py-3">
              <FieldTitle className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={MailIcon}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="size-4 opacity-60"
                />
                Email
              </FieldTitle>
              <RadioGroupItem value="email" id="contact-email" />
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
                Phone
              </FieldTitle>
              <RadioGroupItem value="phone" id="contact-phone" />
            </FieldLabel>
          </Field>
          <Separator />
          <Field>
            <FieldLabel className="justify-between px-4 py-3">
              <FieldTitle className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={Message02Icon}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="size-4 opacity-60"
                />
                Chat
              </FieldTitle>
              <RadioGroupItem value="chat" id="contact-chat" />
            </FieldLabel>
          </Field>
        </FieldGroup>
      </RadioGroup>
    </Card>
  );
}

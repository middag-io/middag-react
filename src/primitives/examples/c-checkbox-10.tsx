import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/primitives/reui/frame";

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
    <Frame className="w-full max-w-xs" spacing="sm">
      <FrameHeader>
        <FrameTitle>Notification Settings</FrameTitle>
      </FrameHeader>
      <FramePanel className="overflow-hidden p-0!">
        <FieldGroup className="gap-0">
          <Field>
            <FieldLabel className="p-3">
              <Checkbox defaultChecked />
              <FieldTitle>Push notifications</FieldTitle>
            </FieldLabel>
          </Field>
          <Separator />
          <Field>
            <FieldLabel className="p-3">
              <Checkbox />
              <FieldTitle>Email notifications</FieldTitle>
            </FieldLabel>
          </Field>
          <Separator />
          <Field>
            <FieldLabel className="p-3">
              <Checkbox />
              <FieldTitle>SMS notifications</FieldTitle>
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FramePanel>
    </Frame>
  );
}

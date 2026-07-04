import { Field } from "@/components/reui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/reui/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mic02Icon, LiveStreaming02Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Field className="max-w-xs">
      <InputGroup>
        <InputGroupAddon>
          <HugeiconsIcon icon={Mic02Icon} strokeWidth={2} />
        </InputGroupAddon>
        <InputGroupInput placeholder="Listening..." />
        <InputGroupAddon align="inline-end">
          <HugeiconsIcon
            icon={LiveStreaming02Icon}
            strokeWidth={2}
            className="text-destructive animate-pulse"
          />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

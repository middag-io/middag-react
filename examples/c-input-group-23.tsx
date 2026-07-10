import { Field } from "@/components/reui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/reui/input-group";
import { Kbd, KbdGroup } from "@/components/reui/kbd";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon, CommandIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Field className="max-w-xs">
      <InputGroup>
        <InputGroupAddon>
          <HugeiconsIcon
            icon={SparklesIcon}
            strokeWidth={2}
            className="text-emerald-500"
          />
        </InputGroupAddon>
        <InputGroupInput placeholder="Ask AI to generate..." />
        <InputGroupAddon align="inline-end">
          <KbdGroup>
            <Kbd>
              <HugeiconsIcon
                icon={CommandIcon}
                strokeWidth={2}
                className="size-3"
              />
            </Kbd>
            <Kbd>Enter</Kbd>
          </KbdGroup>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

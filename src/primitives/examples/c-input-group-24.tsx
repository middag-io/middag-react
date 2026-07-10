import { Field } from "@/primitives/reui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/primitives/reui/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Field className="max-w-xs">
      <InputGroup>
        <InputGroupInput defaultValue="reui_dev" />
        <InputGroupAddon align="inline-end">
          <div className="flex size-4 items-center justify-center rounded-full bg-emerald-500">
            <HugeiconsIcon
              icon={Tick02Icon}
              strokeWidth={2}
              className="size-3 text-white"
            />
          </div>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

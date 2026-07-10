import { toast } from "sonner";

import { Field } from "@/primitives/reui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/primitives/reui/input-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon, CopyIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Field className="max-w-xs">
      <InputGroup>
        <InputGroupInput placeholder="Component name..." />
        <InputGroupAddon align="inline-end">
          <HugeiconsIcon
            icon={StarIcon}
            strokeWidth={2}
            className="text-muted-foreground size-4"
          />
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            onClick={() => toast.success("Copied to clipboard")}
          >
            <HugeiconsIcon icon={CopyIcon} strokeWidth={2} className="size-4" />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

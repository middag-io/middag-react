import { Field, FieldLabel } from "@/primitives/reui/field";
import { Switch } from "@/primitives/reui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/primitives/reui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import { HelpCircleIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <Field orientation="horizontal">
        <Switch id="sw-tooltip" />
        <div className="flex items-center gap-1.5">
          <FieldLabel htmlFor="sw-tooltip">
            Two-factor authentication
          </FieldLabel>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="text-muted-foreground">
                <HugeiconsIcon
                  icon={HelpCircleIcon}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="size-3.5"
                />
              </TooltipTrigger>
              <TooltipContent side="right">
                Adds an extra layer of security by requiring a verification code
                on login.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </Field>
    </div>
  );
}

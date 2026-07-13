import { Checkbox } from "@/primitives/reui/checkbox";
import { Field, FieldLabel } from "@/primitives/reui/field";
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
    <Field orientation="horizontal" className="w-auto">
      <Checkbox id="tooltip-checkbox" />

      <div className="flex items-center gap-1.5">
        <FieldLabel htmlFor="tooltip-checkbox">
          Enable advanced analytics
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
              Advanced analytics provides deeper insights into user behavior and
              system performance.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </Field>
  );
}

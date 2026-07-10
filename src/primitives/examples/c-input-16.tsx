import { Field, FieldDescription, FieldLabel } from "@/primitives/reui/field";
import { Input } from "@/primitives/reui/input";
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
    <Field className="max-w-xs">
      <div className="flex items-center gap-2">
        <FieldLabel htmlFor="username">Username</FieldLabel>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="inline-flex items-center">
              <HugeiconsIcon
                icon={HelpCircleIcon}
                strokeWidth={2}
                className="text-muted-foreground size-3.5"
              />
            </TooltipTrigger>
            <TooltipContent>
              Your unique identifier on the platform.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <Input id="username" placeholder="johndoe" />
      <FieldDescription>
        Your unique identifier on the platform.
      </FieldDescription>
    </Field>
  );
}

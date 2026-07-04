import { Field, FieldLabel } from "@/components/reui/field";
import { RadioGroup, RadioGroupItem } from "@/components/reui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/reui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import { HelpCircleIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <TooltipProvider>
      <RadioGroup defaultValue="public" className="w-full max-w-xs">
        <Field orientation="horizontal">
          <RadioGroupItem value="public" id="vis-public" />
          <div className="flex items-center gap-1.5">
            <FieldLabel htmlFor="vis-public">Public</FieldLabel>
            <Tooltip>
              <TooltipTrigger className="text-muted-foreground">
                <span>
                  <HugeiconsIcon
                    icon={HelpCircleIcon}
                    strokeWidth={2}
                    aria-hidden="true"
                    className="size-3.5"
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent side="right">
                Anyone on the internet can see this.
              </TooltipContent>
            </Tooltip>
          </div>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="private" id="vis-private" />
          <div className="flex items-center gap-1.5">
            <FieldLabel htmlFor="vis-private">Private</FieldLabel>
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
                Only you and collaborators can access this.
              </TooltipContent>
            </Tooltip>
          </div>
        </Field>
      </RadioGroup>
    </TooltipProvider>
  );
}

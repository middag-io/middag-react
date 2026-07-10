import { Toggle } from "@/primitives/reui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/primitives/reui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import { Pin02Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle variant="outline" aria-label="Pin to sidebar">
              <HugeiconsIcon icon={Pin02Icon} strokeWidth={2} />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">Pin to sidebar</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

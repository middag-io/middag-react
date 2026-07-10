import { Badge } from "@/primitives/reui/badge";

import { Button } from "@/primitives/reui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/primitives/reui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert01Icon, Alert02Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Warning">
              <HugeiconsIcon icon={Alert01Icon} strokeWidth={2} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex items-center gap-2 text-sm">
              <HugeiconsIcon
                icon={Alert02Icon}
                strokeWidth={2}
                className="size-4 shrink-0"
              />
              This action cannot be undone
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

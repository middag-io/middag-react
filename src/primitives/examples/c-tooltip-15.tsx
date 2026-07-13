import { Badge } from "@/primitives/reui/badge";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/primitives/reui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tag01Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
            <div className="flex items-center gap-1.5 text-sm">
              <HugeiconsIcon
                icon={Tag01Icon}
                strokeWidth={2}
                className="size-3.5"
                aria-hidden="true"
              />
              3 labels
            </div>
          </TooltipTrigger>
          <TooltipContent className="p-3">
            <div className="flex flex-col gap-2">
              <span className="font-medium">Labels</span>
              <div className="flex items-center gap-1.5">
                <Badge variant="destructive" size="xs">
                  Bug
                </Badge>
                <Badge variant="info" size="xs">
                  Frontend
                </Badge>
                <Badge variant="warning" size="xs">
                  High Priority
                </Badge>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

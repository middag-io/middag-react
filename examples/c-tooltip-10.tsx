import { Badge } from "@/components/reui/badge";

import { Button } from "@/components/reui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/reui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import { SquareLock01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Pro feature">
              <HugeiconsIcon icon={SquareLock01Icon} strokeWidth={2} />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-64 p-3">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                  Advanced Analytics
                </span>
                <Badge variant="success" size="sm">
                  Pro
                </Badge>
              </div>
              <p className="text-xs opacity-80">
                Unlock detailed insights, custom reports, and real-time
                dashboards.
              </p>
              <Button size="sm" className="border-border/40 border">
                Upgrade to Pro
                <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
              </Button>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

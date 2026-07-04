import { Badge } from "@/components/reui/badge";

import { Button } from "@/components/reui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/reui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  InformationCircleIcon,
  ArrowRightIcon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Notifications">
              <div className="relative">
                <HugeiconsIcon icon={InformationCircleIcon} strokeWidth={2} />
                <Badge
                  variant="destructive"
                  size="xs"
                  className="absolute -top-3.5 -right-3.5"
                >
                  3
                </Badge>
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="p-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">Notifications</span>
                <Badge variant="destructive" size="xs">
                  3 new
                </Badge>
              </div>
              <div className="flex flex-col gap-1 opacity-80">
                <p>• Sarah commented on your PR</p>
                <p>• Build #421 completed</p>
                <p>• New team member joined</p>
              </div>
              <a
                href="#"
                className="flex items-center gap-1 font-medium underline underline-offset-2"
              >
                View all
                <HugeiconsIcon
                  icon={ArrowRightIcon}
                  strokeWidth={2}
                  className="size-3.5"
                />
              </a>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

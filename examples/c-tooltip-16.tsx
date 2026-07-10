import { Button } from "@/components/reui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/reui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import { NotificationIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <div className="relative">
                <HugeiconsIcon icon={NotificationIcon} strokeWidth={2} />
                <span className="bg-destructive absolute -top-1 -right-1 block size-2 rounded-full" />
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium">3 new notifications</p>
              <a
                href="#"
                className="text-xs font-medium underline underline-offset-2"
              >
                View all &rarr;
              </a>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

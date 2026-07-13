import { Button } from "@/primitives/reui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/primitives/reui/tooltip";

const sides = [
  "inline-start",
  "left",
  "top",
  "bottom",
  "right",
  "inline-end",
] as const;

export function Pattern() {
  return (
    <TooltipProvider>
      <div className="grid max-w-xs grid-cols-3 gap-2">
        {sides.map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger asChild>
              <Button variant="outline" className="w-full">
                {side.replace("-", " ")[0].toUpperCase() +
                  side.replace("-", " ").slice(1)}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={side}>
              <p className="text-sm">Add to library</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}

import { Button } from "@/primitives/reui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/primitives/reui/hover-card";

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
    <div className="grid grid-cols-3 gap-2">
      {sides.map((side) => (
        <HoverCard key={side} openDelay={100} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Button variant="outline" className="flex-1 capitalize">
              {side.replace("-", " ")}
            </Button>
          </HoverCardTrigger>

          <HoverCardContent side={side}>
            <div className="flex flex-col gap-1">
              <h4 className="font-medium">Hover Card</h4>
              <p className="text-muted-foreground">
                This hover card appears on the {side.replace("-", " ")} side of
                the trigger.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
}

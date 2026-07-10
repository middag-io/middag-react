import { Button } from "@/components/reui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/reui/popover";

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
        <Popover key={side}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full capitalize">
              {side.replace("-", " ")}
            </Button>
          </PopoverTrigger>
          <PopoverContent side={side} className="w-40">
            <p>Popover on {side.replace("-", " ")}</p>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
}

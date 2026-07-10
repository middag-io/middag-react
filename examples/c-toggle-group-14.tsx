import { ToggleGroup, ToggleGroupItem } from "@/components/reui/toggle-group";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SquareIcon,
  LayoutTwoColumnIcon,
  LayoutThreeColumnIcon,
  GridViewIcon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <ToggleGroup type="single" defaultValue="2" variant="outline">
        <ToggleGroupItem value="1" aria-label="1 column">
          <HugeiconsIcon icon={SquareIcon} strokeWidth={2} />
        </ToggleGroupItem>
        <ToggleGroupItem value="2" aria-label="2 columns">
          <HugeiconsIcon icon={LayoutTwoColumnIcon} strokeWidth={2} />
        </ToggleGroupItem>
        <ToggleGroupItem value="3" aria-label="3 columns">
          <HugeiconsIcon icon={LayoutThreeColumnIcon} strokeWidth={2} />
        </ToggleGroupItem>
        <ToggleGroupItem value="4" aria-label="4 columns">
          <HugeiconsIcon icon={GridViewIcon} strokeWidth={2} />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

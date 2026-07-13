import { ToggleGroup, ToggleGroupItem } from "@/primitives/reui/toggle-group";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Menu01Icon,
  GridViewIcon,
  LayoutTwoColumnIcon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <ToggleGroup type="single" defaultValue="list" variant="outline">
        <ToggleGroupItem value="list" aria-label="List view">
          <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} />
        </ToggleGroupItem>
        <ToggleGroupItem value="grid" aria-label="Grid view">
          <HugeiconsIcon icon={GridViewIcon} strokeWidth={2} />
        </ToggleGroupItem>
        <ToggleGroupItem value="kanban" aria-label="Kanban view">
          <HugeiconsIcon icon={LayoutTwoColumnIcon} strokeWidth={2} />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

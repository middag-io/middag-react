import { ToggleGroup, ToggleGroupItem } from "@/components/reui/toggle-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp02Icon, ArrowDown02Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <ToggleGroup type="single" defaultValue="asc" variant="outline" size="sm">
        <ToggleGroupItem value="asc" aria-label="Sort ascending">
          <HugeiconsIcon icon={ArrowUp02Icon} strokeWidth={2} />
          Ascending
        </ToggleGroupItem>
        <ToggleGroupItem value="desc" aria-label="Sort descending">
          <HugeiconsIcon icon={ArrowDown02Icon} strokeWidth={2} />
          Descending
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

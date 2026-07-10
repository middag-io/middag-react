import { ToggleGroup, ToggleGroupItem } from "@/primitives/reui/toggle-group";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Sun01Icon,
  Moon02Icon,
  ComputerIcon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <ToggleGroup type="single" defaultValue="light" variant="outline">
        <ToggleGroupItem value="light" aria-label="Light theme">
          <HugeiconsIcon icon={Sun01Icon} strokeWidth={2} />
          Light
        </ToggleGroupItem>
        <ToggleGroupItem value="dark" aria-label="Dark theme">
          <HugeiconsIcon icon={Moon02Icon} strokeWidth={2} />
          Dark
        </ToggleGroupItem>
        <ToggleGroupItem value="system" aria-label="System theme">
          <HugeiconsIcon icon={ComputerIcon} strokeWidth={2} />
          System
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

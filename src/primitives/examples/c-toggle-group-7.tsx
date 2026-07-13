import { ToggleGroup, ToggleGroupItem } from "@/primitives/reui/toggle-group";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  Menu01Icon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <ToggleGroup type="single" defaultValue="left" spacing={1}>
        <ToggleGroupItem value="left" aria-label="Align left">
          <HugeiconsIcon icon={TextAlignLeftIcon} strokeWidth={2} />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <HugeiconsIcon icon={TextAlignCenterIcon} strokeWidth={2} />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <HugeiconsIcon icon={TextAlignRightIcon} strokeWidth={2} />
        </ToggleGroupItem>
        <ToggleGroupItem value="justify" aria-label="Justify">
          <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

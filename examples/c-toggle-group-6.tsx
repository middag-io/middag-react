import { ToggleGroup, ToggleGroupItem } from "@/components/reui/toggle-group";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <ToggleGroup
        type="multiple"
        orientation="vertical"
        variant="outline"
        spacing={1}
      >
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <HugeiconsIcon icon={TextBoldIcon} strokeWidth={2} />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <HugeiconsIcon icon={TextItalicIcon} strokeWidth={2} />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline">
          <HugeiconsIcon icon={TextUnderlineIcon} strokeWidth={2} />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

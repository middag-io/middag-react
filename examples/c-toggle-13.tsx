import { Toggle } from "@/components/reui/toggle";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  TextStrikethroughIcon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Toggle aria-label="Enabled default">
        <HugeiconsIcon icon={TextBoldIcon} strokeWidth={2} />
      </Toggle>
      <Toggle variant="outline" aria-label="Enabled outline">
        <HugeiconsIcon icon={TextItalicIcon} strokeWidth={2} />
      </Toggle>
      <Toggle disabled aria-label="Disabled default">
        <HugeiconsIcon icon={TextUnderlineIcon} strokeWidth={2} />
      </Toggle>
      <Toggle variant="outline" disabled aria-label="Disabled outline">
        <HugeiconsIcon icon={TextStrikethroughIcon} strokeWidth={2} />
      </Toggle>
    </div>
  );
}

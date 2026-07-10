import { Toggle } from "@/components/reui/toggle";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  TextBoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Toggle aria-label="Toggle bold" defaultPressed>
        <HugeiconsIcon icon={TextBoldIcon} strokeWidth={2} />
      </Toggle>
      <Toggle aria-label="Toggle italic">
        <HugeiconsIcon icon={TextItalicIcon} strokeWidth={2} />
      </Toggle>
      <Toggle aria-label="Toggle underline">
        <HugeiconsIcon icon={TextUnderlineIcon} strokeWidth={2} />
      </Toggle>
    </div>
  );
}

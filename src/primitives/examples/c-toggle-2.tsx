import { Toggle } from "@/primitives/reui/toggle";
import { HugeiconsIcon } from "@hugeicons/react";
import { TextItalicIcon, TextBoldIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Toggle variant="outline" aria-label="Toggle italic">
        <HugeiconsIcon icon={TextItalicIcon} strokeWidth={2} />
        Italic
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle bold">
        <HugeiconsIcon icon={TextBoldIcon} strokeWidth={2} />
        Bold
      </Toggle>
    </div>
  );
}

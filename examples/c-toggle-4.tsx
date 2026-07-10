import { Button } from "@/components/reui/button";
import { Toggle } from "@/components/reui/toggle";
import { HugeiconsIcon } from "@hugeicons/react";
import { TextBoldIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline">
          Button
        </Button>
        <Toggle variant="outline" size="sm" aria-label="Small toggle">
          Toggle
        </Toggle>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon">
          <HugeiconsIcon icon={TextBoldIcon} strokeWidth={2} />
        </Button>
        <Toggle variant="outline" aria-label="Toggle bold icon">
          <HugeiconsIcon icon={TextBoldIcon} strokeWidth={2} />
        </Toggle>
      </div>
    </div>
  );
}

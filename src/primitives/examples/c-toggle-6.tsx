import { Toggle } from "@/primitives/reui/toggle";
import { HugeiconsIcon } from "@hugeicons/react";
import { Bookmark02Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <Toggle variant="outline" aria-label="Toggle bookmark">
        <HugeiconsIcon
          icon={Bookmark02Icon}
          strokeWidth={2}
          className="group-data-[state=on]/toggle:fill-accent-foreground"
        />
        Bookmark
      </Toggle>
    </div>
  );
}

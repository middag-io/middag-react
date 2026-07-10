import { Toggle } from "@/components/reui/toggle";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground w-16 text-sm">Small</span>
        <Toggle variant="outline" size="sm" aria-label="Toggle star small">
          <HugeiconsIcon icon={StarIcon} strokeWidth={2} />
        </Toggle>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground w-16 text-sm">Default</span>
        <Toggle
          variant="outline"
          size="default"
          aria-label="Toggle star default"
        >
          <HugeiconsIcon icon={StarIcon} strokeWidth={2} />
        </Toggle>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-muted-foreground w-16 text-sm">Large</span>
        <Toggle variant="outline" size="lg" aria-label="Toggle star large">
          <HugeiconsIcon icon={StarIcon} strokeWidth={2} />
        </Toggle>
      </div>
    </div>
  );
}

import { Button } from "@/components/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ThumbsUpIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Button className="pe-0">
      <HugeiconsIcon icon={ThumbsUpIcon} strokeWidth={2} aria-hidden="true" />
      Like
      <span className="relative ms-1 px-3 text-xs font-medium opacity-80 before:absolute before:inset-0 before:left-0 before:w-px before:bg-[currentColor]/60">
        456
      </span>
    </Button>
  );
}

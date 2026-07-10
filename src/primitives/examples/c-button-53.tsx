import { Button } from "@/primitives/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Button className="group/sliding relative overflow-hidden rounded-full px-6">
      <span className="inline-flex items-center transition-transform duration-300 group-hover/sliding:-translate-x-2">
        Get Started
      </span>
      <HugeiconsIcon
        icon={ArrowRight02Icon}
        strokeWidth={2}
        aria-hidden="true"
        className="absolute right-2.5 translate-x-8 opacity-0 transition-all duration-300 group-hover/sliding:translate-x-0 group-hover/sliding:opacity-100"
      />
    </Button>
  );
}

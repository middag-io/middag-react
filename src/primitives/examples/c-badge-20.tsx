import { Badge } from "@/primitives/reui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Badge variant="outline">
      <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} />
      Badge
    </Badge>
  );
}

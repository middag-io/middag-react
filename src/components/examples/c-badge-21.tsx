import { Badge } from "@/components/reui/badge";

import { Button } from "@/components/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { MultiplicationSignIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Badge variant="outline" className="gap-0.5">
      Badge
      <Button
        variant="ghost"
        size="icon"
        className="size-3 hover:bg-transparent"
      >
        <HugeiconsIcon icon={MultiplicationSignIcon} strokeWidth={2} />
      </Button>
    </Badge>
  );
}

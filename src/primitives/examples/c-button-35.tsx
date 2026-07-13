import { useState } from "react";

import { Button } from "@/primitives/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowUp01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Button variant="ghost" onClick={() => setIsExpanded(!isExpanded)}>
      {isExpanded ? "Show less" : "Show more"}
      {isExpanded ? (
        <HugeiconsIcon
          icon={ArrowUp01Icon}
          strokeWidth={2}
          aria-hidden="true"
        />
      ) : (
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          strokeWidth={2}
          aria-hidden="true"
        />
      )}
    </Button>
  );
}

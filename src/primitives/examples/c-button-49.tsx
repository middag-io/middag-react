import Link from "next/link";

import { Button } from "@/primitives/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Button variant="link" asChild>
      <Link href="#">
        <HugeiconsIcon
          icon={ArrowLeft01Icon}
          strokeWidth={2}
          data-icon="inline-start"
          aria-hidden="true"
        />
        Go back
      </Link>
    </Button>
  );
}

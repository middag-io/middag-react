import { Button } from "@/components/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { CloudDownloadIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Button>
      <HugeiconsIcon
        icon={CloudDownloadIcon}
        strokeWidth={2}
        aria-hidden="true"
      />
      Download
    </Button>
  );
}

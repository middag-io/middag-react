import { Button } from "@/primitives/reui/button";
import { ButtonGroup } from "@/primitives/reui/button-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { Attachment02Icon, Download01Icon } from "@hugeicons/core-free-icons";

const attachment = {
  name: "Q4-Product-Roadmap.pdf",
  size: "2.4 MB",
};

export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant="outline" size="xs">
        <HugeiconsIcon
          icon={Attachment02Icon}
          strokeWidth={2}
          aria-hidden="true"
        />
        {attachment.name}
        <span className="opacity-60">({attachment.size})</span>
      </Button>
      <Button variant="outline" size="icon-xs" aria-label="Download attachment">
        <HugeiconsIcon
          icon={Download01Icon}
          strokeWidth={2}
          aria-hidden="true"
        />
      </Button>
    </ButtonGroup>
  );
}

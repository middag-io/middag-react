import { Button } from "@/primitives/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { MailIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Button>
      <HugeiconsIcon icon={MailIcon} strokeWidth={2} aria-hidden="true" />
      Login with Email
    </Button>
  );
}

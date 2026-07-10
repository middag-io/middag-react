import { Button } from "@/components/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { LogoutSquare01Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Button variant="ghost">
      Logout
      <HugeiconsIcon
        icon={LogoutSquare01Icon}
        strokeWidth={2}
        aria-hidden="true"
      />
    </Button>
  );
}

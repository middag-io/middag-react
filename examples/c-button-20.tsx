import { Button } from "@/components/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { SettingsIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Button variant="ghost">
      <HugeiconsIcon icon={SettingsIcon} strokeWidth={2} aria-hidden="true" />
      Settings
    </Button>
  );
}

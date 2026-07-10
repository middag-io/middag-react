import { Alert, AlertAction, AlertTitle } from "@/primitives/reui/alert";

import { Button } from "@/primitives/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShieldEnergyIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Alert>
      <HugeiconsIcon icon={ShieldEnergyIcon} strokeWidth={2} />
      <AlertTitle>Update your password and enable 2FA.</AlertTitle>
      <AlertAction>
        <Button variant="outline" size="xs">
          Dismiss
        </Button>
        <Button size="xs">Update</Button>
      </AlertAction>
    </Alert>
  );
}

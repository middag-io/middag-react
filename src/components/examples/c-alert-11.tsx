import { Alert, AlertAction, AlertDescription } from "@/components/reui/alert";

import { Button } from "@/components/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShieldEnergyIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Alert>
      <HugeiconsIcon icon={ShieldEnergyIcon} strokeWidth={2} />
      <AlertDescription>Update your password and enable 2FA.</AlertDescription>
      <AlertAction>
        <Button variant="outline" size="xs">
          Dismiss
        </Button>
        <Button size="xs">Update</Button>
      </AlertAction>
    </Alert>
  );
}

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/primitives/reui/alert";
import { Frame, FramePanel } from "@/primitives/reui/frame";

import { Button } from "@/primitives/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { CreditCardIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="mx-auto mb-auto w-full max-w-lg">
      <Frame>
        <FramePanel className="overflow-hidden p-0!">
          <Alert
            variant="destructive"
            className="bg-destructive/5 border-0 shadow-none"
          >
            <HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} />
            <AlertTitle>Subscription Expiring</AlertTitle>
            <AlertAction>
              <Button size="xs" variant="destructive">
                Renew Now
              </Button>
            </AlertAction>
            <AlertDescription>
              Your annual subscription will expire in 3 days. Renew now to avoid
              service interruption and data loss.
            </AlertDescription>
          </Alert>
        </FramePanel>
      </Frame>
    </div>
  );
}

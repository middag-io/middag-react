import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/reui/alert";
import { Frame, FramePanel } from "@/components/reui/frame";

import { Button } from "@/components/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShieldEnergyIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="mx-auto mb-auto w-full max-w-lg">
      <Frame>
        <FramePanel className="overflow-hidden p-0!">
          <Alert className="border-0 shadow-none">
            <HugeiconsIcon
              icon={ShieldEnergyIcon}
              strokeWidth={2}
              className="text-emerald-500"
            />
            <AlertTitle>Security Update</AlertTitle>
            <AlertAction>
              <Button variant="outline" size="xs">
                Dismiss
              </Button>
              <Button size="xs">Update</Button>
            </AlertAction>
            <AlertDescription>
              Update your password and enable 2FA to improve your account
              security.
            </AlertDescription>
          </Alert>
        </FramePanel>
      </Frame>
    </div>
  );
}

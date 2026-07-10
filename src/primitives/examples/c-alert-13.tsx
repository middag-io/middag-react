import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/primitives/reui/alert";
import { Frame, FramePanel } from "@/primitives/reui/frame";

import { Button } from "@/primitives/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle01Icon, Alert02Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="mx-auto mb-auto w-full max-w-lg">
      <Frame stacked>
        <FramePanel className="p-0!">
          <Alert
            variant="success"
            className="rounded-none border-0 shadow-none"
          >
            <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} />
            <AlertTitle>Deployment Successful</AlertTitle>
            <AlertDescription>
              Your application has been successfully deployed to the production
              environment.
            </AlertDescription>
          </Alert>
        </FramePanel>
        <FramePanel className="p-0!">
          <Alert
            variant="warning"
            className="rounded-none border-0 shadow-none"
          >
            <HugeiconsIcon
              icon={Alert02Icon}
              strokeWidth={2}
              className="text-yellow-500"
            />
            <AlertTitle>Resource Limit Reached</AlertTitle>
            <AlertAction>
              <Button size="xs">Verify</Button>
            </AlertAction>
            <AlertDescription>
              Your current plan has reached its resource limits. Consider
              upgrading to a higher tier.
            </AlertDescription>
          </Alert>
        </FramePanel>
      </Frame>
    </div>
  );
}

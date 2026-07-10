import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/reui/alert";
import { Frame, FramePanel } from "@/components/reui/frame";

import { Button } from "@/components/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ZapIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="mx-auto mb-auto w-full max-w-lg">
      <Frame>
        <FramePanel className="overflow-hidden p-0!">
          <Alert variant="invert" className="border-0 shadow-none">
            <HugeiconsIcon
              icon={ZapIcon}
              strokeWidth={2}
              className="text-yellow-500"
            />
            <AlertTitle>Pro Feature</AlertTitle>
            <AlertAction>
              <Button
                variant="outline"
                size="xs"
                className="bg-background/10 border-border/10"
              >
                Dismiss
              </Button>
              <Button
                size="xs"
                className="border-blue-800 bg-blue-500 text-white hover:border-blue-900 hover:bg-blue-600"
              >
                Upgrade
              </Button>
            </AlertAction>
            <AlertDescription>
              This feature is only available for Pro users. Upgrade your plan to
              get access.
            </AlertDescription>
          </Alert>
        </FramePanel>
      </Frame>
    </div>
  );
}

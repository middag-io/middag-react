import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/primitives/reui/alert";
import { Frame, FramePanel } from "@/primitives/reui/frame";

import { Button } from "@/primitives/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Database02Icon,
  Globe02Icon,
  Refresh04Icon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="mx-auto mb-auto w-full max-w-lg">
      <Frame stacked>
        <FramePanel className="overflow-hidden p-0!">
          <Alert
            variant="success"
            className="border-0 bg-transparent shadow-none"
          >
            <HugeiconsIcon icon={Database02Icon} strokeWidth={2} />
            <AlertTitle>Database Connected</AlertTitle>
            <AlertDescription>
              All systems operational. Last sync: 2 minutes ago.
            </AlertDescription>
          </Alert>
        </FramePanel>
        <FramePanel className="overflow-hidden p-0!">
          <Alert
            variant="warning"
            className="border-0 bg-transparent shadow-none"
          >
            <HugeiconsIcon icon={Globe02Icon} strokeWidth={2} />
            <AlertTitle>API Latency Warning</AlertTitle>
            <AlertAction>
              <Button size="xs" variant="outline" className="h-7">
                <HugeiconsIcon
                  icon={Refresh04Icon}
                  strokeWidth={2}
                  className="mr-1 size-3"
                />
                Retry
              </Button>
            </AlertAction>
            <AlertDescription>
              Increased latency detected in US-East regions. Our engineers are
              investigating.
            </AlertDescription>
          </Alert>
        </FramePanel>
      </Frame>
    </div>
  );
}

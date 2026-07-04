import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/reui/alert";
import { Frame, FramePanel } from "@/components/reui/frame";

import { Button } from "@/components/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Idea01Icon, MultiplicationSignIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="mx-auto mb-auto w-full max-w-lg">
      <Frame variant="ghost">
        <FramePanel className="overflow-hidden p-0!">
          <Alert variant="info" className="border-0 shadow-none">
            <HugeiconsIcon icon={Idea01Icon} strokeWidth={2} />
            <AlertTitle>New: Advanced Analytics</AlertTitle>
            <AlertAction>
              <Button
                size="xs"
                variant="ghost"
                className="text-muted-foreground hover:text-foreground -mt-1 -mr-2 size-7 p-0 hover:bg-transparent"
              >
                <HugeiconsIcon
                  icon={MultiplicationSignIcon}
                  strokeWidth={2}
                  className="size-3.5"
                />
              </Button>
            </AlertAction>
            <AlertDescription>
              We&apos;ve just released a new dashboard for tracking your
              team&apos;s performance.
              <Button
                variant="link"
                size="sm"
                className="text-info h-auto p-0 underline"
              >
                Explore features
              </Button>
            </AlertDescription>
          </Alert>
        </FramePanel>
      </Frame>
    </div>
  );
}

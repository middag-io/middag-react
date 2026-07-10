import { Alert, AlertDescription, AlertTitle } from "@/components/reui/alert";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Alert variant="warning">
      <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} />
      <AlertTitle>Warning! Something is wrong</AlertTitle>
      <AlertDescription>
        Please check your settings. If the problem persists, contact support.
      </AlertDescription>
    </Alert>
  );
}

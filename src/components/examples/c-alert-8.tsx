import { Alert, AlertDescription, AlertTitle } from "@/components/reui/alert";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Alert variant="destructive">
      <HugeiconsIcon icon={AlertCircleIcon} strokeWidth={2} />
      <AlertTitle>Error! Something went wrong</AlertTitle>
      <AlertDescription>
        Please try again. If the problem persists, contact support.
      </AlertDescription>
    </Alert>
  );
}

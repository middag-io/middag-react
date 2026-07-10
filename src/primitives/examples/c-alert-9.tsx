import { Alert, AlertDescription, AlertTitle } from "@/primitives/reui/alert";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Alert variant="invert">
      <HugeiconsIcon
        icon={AlertCircleIcon}
        strokeWidth={2}
        className="text-success"
      />
      <AlertTitle>Notification! All good</AlertTitle>
      <AlertDescription>
        This is a notification alert with a title and description.
      </AlertDescription>
    </Alert>
  );
}

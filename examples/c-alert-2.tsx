import { Alert, AlertDescription, AlertTitle } from "@/components/reui/alert";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Alert>
      <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} />
      <AlertTitle>Alert!</AlertTitle>
      <AlertDescription>
        This is an alert with icon, title and description.
      </AlertDescription>
    </Alert>
  );
}

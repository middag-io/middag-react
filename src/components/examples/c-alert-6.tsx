import { Alert, AlertDescription, AlertTitle } from "@/components/reui/alert";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Alert variant="success">
      <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} />
      <AlertTitle>Success! All good</AlertTitle>
      <AlertDescription>
        Everything is working as expected. You can continue with your task.
      </AlertDescription>
    </Alert>
  );
}

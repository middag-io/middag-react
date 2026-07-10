import { Alert, AlertDescription, AlertTitle } from "@/primitives/reui/alert";

export function Pattern() {
  return (
    <Alert>
      <AlertTitle>Alert!</AlertTitle>
      <AlertDescription>
        This is an alert with a title and description.
      </AlertDescription>
    </Alert>
  );
}

import { Button } from "@/components/reui/button";
import { Spinner } from "@/components/reui/spinner";

export function Pattern() {
  return (
    <Button disabled>
      <Spinner aria-hidden="true" />
      Please wait
    </Button>
  );
}

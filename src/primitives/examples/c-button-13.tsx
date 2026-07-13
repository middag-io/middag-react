import { Button } from "@/primitives/reui/button";
import { Spinner } from "@/primitives/reui/spinner";

export function Pattern() {
  return (
    <Button disabled>
      <Spinner aria-hidden="true" />
      Please wait
    </Button>
  );
}

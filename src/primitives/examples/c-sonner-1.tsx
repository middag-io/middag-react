import { toast } from "sonner";

import { Button } from "@/primitives/reui/button";

export function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <Button
        onClick={() => toast("Event has been created")}
        variant="outline"
        className="w-fit"
      >
        Show Toast
      </Button>
    </div>
  );
}

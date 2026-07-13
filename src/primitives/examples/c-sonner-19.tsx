import { toast } from "sonner";

import { Button } from "@/primitives/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SentIcon,
  Download01Icon,
  Bookmark02Icon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        size="sm"
        variant="outline"
        className="w-fit"
        onClick={() =>
          toast("Message sent", {
            description: "Your message has been delivered.",
            icon: (
              <HugeiconsIcon
                icon={SentIcon}
                strokeWidth={2}
                className="size-4"
              />
            ),
          })
        }
      >
        Send Icon
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="w-fit"
        onClick={() =>
          toast("Download complete", {
            description: "design-assets.zip is ready.",
            icon: (
              <HugeiconsIcon
                icon={Download01Icon}
                strokeWidth={2}
                className="size-4"
              />
            ),
          })
        }
      >
        Download Icon
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="w-fit"
        onClick={() =>
          toast("Bookmark added", {
            description: "Saved to your collection.",
            icon: (
              <HugeiconsIcon
                icon={Bookmark02Icon}
                strokeWidth={2}
                className="size-4"
              />
            ),
          })
        }
      >
        Bookmark Icon
      </Button>
    </div>
  );
}

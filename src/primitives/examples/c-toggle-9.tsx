import { useState } from "react";

import { Toggle } from "@/primitives/reui/toggle";
import { HugeiconsIcon } from "@hugeicons/react";
import { FavouriteIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  const [pressed, setPressed] = useState(false);

  return (
    <div className="flex items-center justify-center">
      <Toggle
        aria-label="Toggle favorite"
        pressed={pressed}
        onPressedChange={setPressed}
      >
        {pressed ? (
          <HugeiconsIcon
            icon={FavouriteIcon}
            strokeWidth={2}
            className="fill-current"
          />
        ) : (
          <HugeiconsIcon icon={FavouriteIcon} strokeWidth={2} />
        )}
      </Toggle>
    </div>
  );
}

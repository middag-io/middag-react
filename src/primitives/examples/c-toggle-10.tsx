"use client";

import { useState } from "react";

import { Toggle } from "@/primitives/reui/toggle";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BookmarkCheck02Icon,
  Bookmark02Icon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  const [pressed, setPressed] = useState(false);

  return (
    <div className="flex items-center justify-center">
      <Toggle
        variant="outline"
        aria-label="Toggle bookmark"
        pressed={pressed}
        onPressedChange={setPressed}
      >
        {pressed ? (
          <HugeiconsIcon
            icon={BookmarkCheck02Icon}
            strokeWidth={2}
            className="fill-current"
          />
        ) : (
          <HugeiconsIcon icon={Bookmark02Icon} strokeWidth={2} />
        )}
        {pressed ? "Bookmarked" : "Bookmark"}
      </Toggle>
    </div>
  );
}

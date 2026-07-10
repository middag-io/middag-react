import { useState } from "react";

import { Toggle } from "@/primitives/reui/toggle";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FavouriteIcon,
  RepeatIcon,
  Share08Icon,
  Bookmark02Icon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  const [liked, setLiked] = useState(false);
  const [retweeted, setRetweeted] = useState(false);
  const [shared, setShared] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Toggle
        variant="outline"
        aria-label="Like"
        pressed={liked}
        onPressedChange={setLiked}
      >
        <HugeiconsIcon icon={FavouriteIcon} strokeWidth={2} />
        {liked ? 13 : 12}
      </Toggle>
      <Toggle
        variant="outline"
        aria-label="Retweet"
        pressed={retweeted}
        onPressedChange={setRetweeted}
      >
        <HugeiconsIcon icon={RepeatIcon} strokeWidth={2} />
        {retweeted ? 6 : 5}
      </Toggle>
      <Toggle
        variant="outline"
        aria-label="Share"
        pressed={shared}
        onPressedChange={setShared}
      >
        <HugeiconsIcon icon={Share08Icon} strokeWidth={2} />
        {shared ? 4 : 3}
      </Toggle>
      <Toggle
        variant="outline"
        aria-label="Bookmark"
        pressed={bookmarked}
        onPressedChange={setBookmarked}
      >
        <HugeiconsIcon icon={Bookmark02Icon} strokeWidth={2} />
        {bookmarked ? 9 : 8}
      </Toggle>
    </div>
  );
}

"use client";

import { useState } from "react";

import { Toggle } from "@/components/reui/toggle";
import { HugeiconsIcon } from "@hugeicons/react";
import { VolumeOffIcon, VolumeHighIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  const [muted, setMuted] = useState(false);

  return (
    <div className="flex items-center justify-center">
      <Toggle
        size="lg"
        variant="outline"
        aria-label="Toggle mute"
        pressed={muted}
        onPressedChange={setMuted}
      >
        {muted ? (
          <HugeiconsIcon icon={VolumeOffIcon} strokeWidth={2} />
        ) : (
          <HugeiconsIcon icon={VolumeHighIcon} strokeWidth={2} />
        )}
        {muted ? "Muted" : "Sound"}
      </Toggle>
    </div>
  );
}

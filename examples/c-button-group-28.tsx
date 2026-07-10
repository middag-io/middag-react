import { useState } from "react";

import { Button } from "@/components/reui/button";
import { ButtonGroup } from "@/components/reui/button-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { MinusSignIcon, PlusSignIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);

  const increaseVolume = () => {
    setVolume((prev) => Math.min(prev + 5, 100));
    setIsMuted(false);
  };

  const decreaseVolume = () => {
    setVolume((prev) => {
      const next = Math.max(prev - 5, 0);
      if (next === 0) setIsMuted(true);
      return next;
    });
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <ButtonGroup>
      <Button
        onClick={decreaseVolume}
        size="sm"
        variant="outline"
        aria-label="Decrease Volume"
      >
        <HugeiconsIcon
          icon={MinusSignIcon}
          strokeWidth={2}
          aria-hidden="true"
        />
      </Button>
      <Button
        onClick={toggleMute}
        size="sm"
        variant="outline"
        className="min-w-20"
      >
        {isMuted ? "Muted" : `${volume}%`}
      </Button>
      <Button
        onClick={increaseVolume}
        size="sm"
        variant="outline"
        aria-label="Increase Volume"
      >
        <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} aria-hidden="true" />
      </Button>
    </ButtonGroup>
  );
}

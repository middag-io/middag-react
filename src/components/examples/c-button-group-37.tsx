import { useState } from "react";

import { Button } from "@/components/reui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/reui/button-group";
import { HugeiconsIcon } from "@hugeicons/react";
import { MinusSignIcon, PlusSignIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 10));
  };

  return (
    <ButtonGroup>
      <Button
        variant="outline"
        size="icon"
        aria-label="Zoom out"
        onClick={handleZoomOut}
      >
        <HugeiconsIcon
          icon={MinusSignIcon}
          strokeWidth={2}
          aria-hidden="true"
        />
      </Button>
      <ButtonGroupText className="w-16 justify-center">{zoom}%</ButtonGroupText>
      <Button
        variant="outline"
        size="icon"
        aria-label="Zoom in"
        onClick={handleZoomIn}
      >
        <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} aria-hidden="true" />
      </Button>
    </ButtonGroup>
  );
}

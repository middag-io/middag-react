import { useState } from "react";

import { Button } from "@/components/reui/button";
import { ButtonGroup } from "@/components/reui/button-group";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  TrendUp01Icon,
  Minus02Icon,
  TrendDown01Icon,
} from "@hugeicons/core-free-icons";

const stances = [
  {
    id: "buy",
    label: "Buy",
    icon: (
      <HugeiconsIcon icon={TrendUp01Icon} strokeWidth={2} aria-hidden="true" />
    ),
  },
  {
    id: "hold",
    label: "Hold",
    icon: (
      <HugeiconsIcon icon={Minus02Icon} strokeWidth={2} aria-hidden="true" />
    ),
  },
  {
    id: "sell",
    label: "Sell",
    icon: (
      <HugeiconsIcon
        icon={TrendDown01Icon}
        strokeWidth={2}
        aria-hidden="true"
      />
    ),
  },
];

export function Pattern() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <ButtonGroup>
      {stances.map((stance) => (
        <Button
          key={stance.id}
          variant={active === stance.id ? "default" : "outline"}
          onClick={() => setActive(active === stance.id ? null : stance.id)}
        >
          {stance.icon}
          {stance.label}
        </Button>
      ))}
    </ButtonGroup>
  );
}

import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/reui/button";
import { ButtonGroup, ButtonGroupText } from "@/components/reui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/reui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Code01Icon,
  TestTube01Icon,
  Globe02Icon,
} from "@hugeicons/core-free-icons";

const environments = [
  {
    id: "development",
    label: "Dev",
    tooltip: "Local development environment",
    icon: (
      <HugeiconsIcon icon={Code01Icon} strokeWidth={2} aria-hidden="true" />
    ),
  },
  {
    id: "staging",
    label: "Staging",
    tooltip: "Pre-production mirror",
    icon: (
      <HugeiconsIcon icon={TestTube01Icon} strokeWidth={2} aria-hidden="true" />
    ),
  },
  {
    id: "production",
    label: "Production",
    tooltip: "Live environment — affects real users",
    icon: (
      <HugeiconsIcon icon={Globe02Icon} strokeWidth={2} aria-hidden="true" />
    ),
  },
];

export function Pattern() {
  const [active, setActive] = useState("development");

  return (
    <ButtonGroup>
      <TooltipProvider>
        {environments.map((env) => (
          <Tooltip key={env.id}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className={cn(active === env.id ? "bg-muted" : "")}
                onClick={() => setActive(env.id)}
              >
                {env.icon}
                {env.label}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{env.tooltip}</TooltipContent>
          </Tooltip>
        ))}
        {active === "production" ? (
          <ButtonGroupText className="bg-transparent">
            <div className="bg-success size-1.5 rounded-full" />
            <span>Live</span>
          </ButtonGroupText>
        ) : null}
      </TooltipProvider>
    </ButtonGroup>
  );
}

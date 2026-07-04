import { useState } from "react";
import { Badge } from "@/components/reui/badge";

import { cn } from "@/lib/utils";
import { Button } from "@/components/reui/button";
import { ButtonGroup } from "@/components/reui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/reui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LightningIcon,
  AiBrain01Icon,
  ExperimentIcon,
} from "@hugeicons/core-free-icons";

const models = [
  {
    id: "gpt4o",
    label: "GPT-4o",
    badge: "Fast",
    badgeVariant: "success-light" as const,
    tooltip: "128k context, fastest response",
    icon: (
      <HugeiconsIcon icon={LightningIcon} strokeWidth={2} aria-hidden="true" />
    ),
  },
  {
    id: "claude",
    label: "Claude",
    badge: "Pro",
    badgeVariant: "info-light" as const,
    tooltip: "200k context, best for analysis",
    icon: (
      <HugeiconsIcon icon={AiBrain01Icon} strokeWidth={2} aria-hidden="true" />
    ),
  },
  {
    id: "gemini",
    label: "Gemini",
    badge: "Preview",
    badgeVariant: "warning-light" as const,
    tooltip: "1M context, experimental",
    icon: (
      <HugeiconsIcon icon={ExperimentIcon} strokeWidth={2} aria-hidden="true" />
    ),
  },
];

export function Pattern() {
  const [active, setActive] = useState("claude");

  return (
    <ButtonGroup>
      <TooltipProvider>
        {models.map((model) => (
          <Tooltip key={model.id}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className={cn(active === model.id ? "bg-muted" : "")}
                onClick={() => setActive(model.id)}
              >
                {model.icon}
                {model.label}
                <Badge variant={model.badgeVariant} size="xs">
                  {model.badge}
                </Badge>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{model.tooltip}</TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </ButtonGroup>
  );
}

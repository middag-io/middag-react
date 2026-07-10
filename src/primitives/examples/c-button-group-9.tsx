import { Button } from "@/primitives/reui/button";
import { ButtonGroup } from "@/primitives/reui/button-group";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/primitives/reui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/primitives/reui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import { SentIcon, AudioWave01Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon">
          <HugeiconsIcon icon={SentIcon} strokeWidth={2} aria-hidden="true" />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <InputGroup>
          <InputGroupInput placeholder="Send a message..." />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupAddon align="inline-end">
                  <HugeiconsIcon
                    icon={AudioWave01Icon}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </InputGroupAddon>
              </TooltipTrigger>
              <TooltipContent>Voice Mode</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </InputGroup>
      </ButtonGroup>
    </ButtonGroup>
  );
}

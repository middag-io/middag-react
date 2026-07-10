import { useState } from "react";

import { Button } from "@/components/reui/button";
import { ButtonGroup } from "@/components/reui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/reui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import { Code01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";

const services = ["Resend API", "Stripe API", "GitHub API"];
const environments = ["Production", "Staging", "Development"];
const versions = ["v2", "v1", "beta"];

export function Pattern() {
  const [service, setService] = useState(services[0]);
  const [environment, setEnvironment] = useState(environments[0]);
  const [version, setVersion] = useState(versions[0]);

  return (
    <ButtonGroup>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 text-xs font-normal"
            aria-label="Select API service"
          >
            <HugeiconsIcon
              icon={Code01Icon}
              strokeWidth={2}
              className="size-3.5 opacity-60"
              aria-hidden="true"
            />
            {service}
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={2}
              className="size-3 opacity-60"
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          <DropdownMenuGroup>
            {services.map((item) => (
              <DropdownMenuItem key={item} onClick={() => setService(item)}>
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="text-muted-foreground h-7 gap-1 text-xs font-normal"
            aria-label="Select environment"
          >
            {environment}
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={2}
              className="size-3 opacity-60"
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-36">
          <DropdownMenuGroup>
            {environments.map((item) => (
              <DropdownMenuItem key={item} onClick={() => setEnvironment(item)}>
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="text-muted-foreground h-7 gap-1 font-mono text-xs"
            aria-label="Select API version"
          >
            {version}
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={2}
              className="size-3 opacity-60"
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-24">
          <DropdownMenuGroup>
            {versions.map((item) => (
              <DropdownMenuItem key={item} onClick={() => setVersion(item)}>
                <span className="font-mono">{item}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}

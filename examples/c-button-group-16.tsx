import { Button } from "@/components/reui/button";
import { ButtonGroup } from "@/components/reui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/reui/dropdown-menu";
import { Input } from "@/components/reui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FilterMailIcon,
  ArrowDown01Icon,
  MultiplicationSignIcon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <ButtonGroup className="max-w-xs">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" aria-label="Filter">
            <HugeiconsIcon
              icon={FilterMailIcon}
              strokeWidth={2}
              aria-hidden="true"
            />
            Filter
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              strokeWidth={2}
              aria-hidden="true"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          <DropdownMenuItem>All Records</DropdownMenuItem>
          <DropdownMenuItem>Recent</DropdownMenuItem>
          <DropdownMenuItem>Archived</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Input placeholder="Filter records..." />
      <Button variant="outline" size="icon">
        <HugeiconsIcon
          icon={MultiplicationSignIcon}
          strokeWidth={2}
          aria-hidden="true"
        />
      </Button>
    </ButtonGroup>
  );
}

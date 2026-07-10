import { Button } from "@/primitives/reui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/primitives/reui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/primitives/reui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CreditCardIcon,
  Tick02Icon,
  ArrowDown01Icon,
  Calendar01Icon,
  FileEditIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <ButtonGroup>
        <ButtonGroupText className="border-input bg-muted/40 text-muted-foreground gap-1.5 border px-2.5 text-xs">
          <HugeiconsIcon
            icon={CreditCardIcon}
            strokeWidth={2}
            className="size-3.5 opacity-60"
            aria-hidden="true"
          />
          <span className="text-foreground font-medium tabular-nums">
            USD 12,480
          </span>
        </ButtonGroupText>
        <Button variant="outline" size="sm">
          Hold
        </Button>
      </ButtonGroup>

      <ButtonGroup className="**:data-[slot=button]:border-r-0">
        <Button size="sm">
          <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} aria-hidden="true" />
          Release
        </Button>
        <ButtonGroupSeparator className="bg-primary/72" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon-sm"
              className="border-primary-foreground/20 rounded-l-none border-l"
              aria-label="More payout actions"
            >
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                strokeWidth={2}
                aria-hidden="true"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="w-44">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <HugeiconsIcon
                  icon={Calendar01Icon}
                  strokeWidth={2}
                  className="size-4 opacity-60"
                  aria-hidden="true"
                />
                Schedule for Friday
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon
                  icon={CreditCardIcon}
                  strokeWidth={2}
                  className="size-4 opacity-60"
                  aria-hidden="true"
                />
                Change destination
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HugeiconsIcon
                  icon={FileEditIcon}
                  strokeWidth={2}
                  className="size-4 opacity-60"
                  aria-hidden="true"
                />
                Export receipt
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Cancel payout
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </div>
  );
}

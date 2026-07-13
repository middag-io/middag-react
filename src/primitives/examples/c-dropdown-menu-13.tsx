import { Button } from "@/primitives/reui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/primitives/reui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Share08Icon,
  MailIcon,
  Message02Icon,
  Link01Icon,
  File02Icon,
  GoogleSheetIcon,
  ImageIcon,
  PrinterIcon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-fit gap-2">
            <HugeiconsIcon
              icon={Share08Icon}
              strokeWidth={2}
              aria-hidden="true"
            />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="start">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Share via</DropdownMenuLabel>
            <DropdownMenuItem>
              <HugeiconsIcon
                icon={MailIcon}
                strokeWidth={2}
                aria-hidden="true"
              />
              Email
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HugeiconsIcon
                icon={Message02Icon}
                strokeWidth={2}
                aria-hidden="true"
              />
              Message
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HugeiconsIcon
                icon={Link01Icon}
                strokeWidth={2}
                aria-hidden="true"
              />
              Copy Link
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel>Export as</DropdownMenuLabel>
            <DropdownMenuItem>
              <HugeiconsIcon
                icon={File02Icon}
                strokeWidth={2}
                aria-hidden="true"
              />
              PDF
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HugeiconsIcon
                icon={GoogleSheetIcon}
                strokeWidth={2}
                aria-hidden="true"
              />
              CSV
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HugeiconsIcon
                icon={ImageIcon}
                strokeWidth={2}
                aria-hidden="true"
              />
              PNG
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <HugeiconsIcon
              icon={PrinterIcon}
              strokeWidth={2}
              aria-hidden="true"
            />
            Print
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

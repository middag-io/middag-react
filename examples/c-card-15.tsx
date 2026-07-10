import { Badge } from "@/components/reui/badge";

import { Button } from "@/components/reui/button";
import { Card, CardContent } from "@/components/reui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/reui/dropdown-menu";
import { Separator } from "@/components/reui/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MoreHorizontalCircle01Icon,
  Settings01Icon,
  Alert02Icon,
  Pin02Icon,
  Share08Icon,
  DeleteIcon,
  ArrowUp02Icon,
  ArrowDown02Icon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  const title = "Revenue";
  const value = "$12.4k";
  const delta = 12.5;
  const positive = true;
  const lastMonth = "$11.0k";

  return (
    <Card className="w-full max-w-xs">
      <CardContent className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="-me-1.5"
                aria-label="More options"
              >
                <HugeiconsIcon
                  icon={MoreHorizontalCircle01Icon}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <HugeiconsIcon
                    icon={Settings01Icon}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HugeiconsIcon
                    icon={Alert02Icon}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  Add Alert
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HugeiconsIcon
                    icon={Pin02Icon}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  Pin to Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HugeiconsIcon
                    icon={Share08Icon}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  Share
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <HugeiconsIcon
                    icon={DeleteIcon}
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5">
            <span className="text-foreground text-2xl font-medium tracking-tight tabular-nums">
              {value}
            </span>
            <Badge variant={positive ? "success-light" : "destructive-light"}>
              {positive ? (
                <HugeiconsIcon
                  icon={ArrowUp02Icon}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              ) : (
                <HugeiconsIcon
                  icon={ArrowDown02Icon}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              )}
              {delta}%
            </Badge>
          </div>
          <Separator />
          <div className="text-muted-foreground text-xs">
            Vs last month:{" "}
            <span className="text-foreground font-medium tabular-nums">
              {lastMonth}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

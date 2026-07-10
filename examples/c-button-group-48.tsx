import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/reui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/reui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/reui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FilterIcon,
  Download01Icon,
  ArrowDown01Icon,
  GridViewIcon,
  Menu01Icon,
  GoogleSpreadsheetIcon,
  FileJsonIcon,
  FilePdf01Icon,
} from "@hugeicons/core-free-icons";

const icons = {
  filter: (
    <HugeiconsIcon icon={FilterIcon} strokeWidth={2} aria-hidden="true" />
  ),
  download: (
    <HugeiconsIcon icon={Download01Icon} strokeWidth={2} aria-hidden="true" />
  ),
  chevronDown: (
    <HugeiconsIcon icon={ArrowDown01Icon} strokeWidth={2} aria-hidden="true" />
  ),
  grid: (
    <HugeiconsIcon icon={GridViewIcon} strokeWidth={2} aria-hidden="true" />
  ),
  list: <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} aria-hidden="true" />,
  fileSpreadsheet: (
    <HugeiconsIcon
      icon={GoogleSpreadsheetIcon}
      strokeWidth={2}
      aria-hidden="true"
    />
  ),
  fileJson: (
    <HugeiconsIcon icon={FileJsonIcon} strokeWidth={2} aria-hidden="true" />
  ),
  filePdf: (
    <HugeiconsIcon icon={FilePdf01Icon} strokeWidth={2} aria-hidden="true" />
  ),
};

export function Pattern() {
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <ButtonGroup>
      <Button variant="outline">
        {icons.filter}
        Filter
      </Button>
      <ButtonGroupSeparator />
      <Button variant="outline">
        {icons.download}
        Export CSV
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            aria-label="More export options"
          >
            {icons.chevronDown}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              {icons.fileSpreadsheet}
              Export Excel
            </DropdownMenuItem>
            <DropdownMenuItem>
              {icons.fileJson}
              Export JSON
            </DropdownMenuItem>
            <DropdownMenuItem>
              {icons.filePdf}
              Export PDF
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="outline"
        size="icon"
        aria-label="Grid view"
        className={cn(view === "grid" ? "bg-muted" : "")}
        onClick={() => setView("grid")}
      >
        {icons.grid}
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label="List view"
        className={cn(view === "list" ? "bg-muted" : "")}
        onClick={() => setView("list")}
      >
        {icons.list}
      </Button>
    </ButtonGroup>
  );
}

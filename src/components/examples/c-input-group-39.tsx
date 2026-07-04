import { useState } from "react";

import { Checkbox } from "@/components/reui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/reui/dropdown-menu";
import { Field } from "@/components/reui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/reui/input-group";
import { Label } from "@/components/reui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/reui/popover";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Search01Icon,
  Cancel01Icon,
  FilterIcon,
  MoreHorizontalCircle01Icon,
} from "@hugeicons/core-free-icons";

const statuses = ["Active", "Lead", "Prospect"] as const;

const statusCounts: Record<(typeof statuses)[number], number> = {
  Active: 12,
  Lead: 7,
  Prospect: 5,
};

export function Pattern() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<
    (typeof statuses)[number][]
  >([]);

  return (
    <Field className="max-w-sm">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <HugeiconsIcon
            icon={Search01Icon}
            strokeWidth={2}
            aria-hidden="true"
          />
        </InputGroupAddon>

        <InputGroupInput
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />

        <InputGroupAddon align="inline-end" className="gap-1">
          {searchQuery.length > 0 ? (
            <InputGroupButton
              aria-label="Clear search"
              size="icon-xs"
              variant="ghost"
              onClick={() => setSearchQuery("")}
            >
              <HugeiconsIcon
                icon={Cancel01Icon}
                strokeWidth={2}
                aria-hidden="true"
              />
            </InputGroupButton>
          ) : null}

          <Popover>
            <PopoverTrigger asChild>
              <InputGroupButton
                variant="ghost"
                size="xs"
                className="gap-1.5"
                aria-label="Filter contacts"
              >
                <HugeiconsIcon
                  icon={FilterIcon}
                  strokeWidth={2}
                  className="size-3.5"
                  aria-hidden="true"
                />
                {selectedStatuses.length > 0 ? (
                  <span className="tabular-nums">
                    {selectedStatuses.length}
                  </span>
                ) : (
                  "Status"
                )}
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-44 p-3">
              <div className="flex flex-col gap-2">
                {statuses.map((status) => (
                  <div key={status} className="flex items-center gap-2.5">
                    <Checkbox
                      id={`contact-status-${status}`}
                      checked={selectedStatuses.includes(status)}
                      onCheckedChange={() =>
                        setSelectedStatuses((previous) =>
                          previous.includes(status)
                            ? previous.filter((item) => item !== status)
                            : [...previous, status],
                        )
                      }
                    />
                    <Label
                      htmlFor={`contact-status-${status}`}
                      className="flex grow items-center justify-between gap-1.5 font-normal"
                    >
                      {status}
                      <span className="text-muted-foreground text-xs">
                        {statusCounts[status]}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton
                variant="ghost"
                size="icon-xs"
                aria-label="More actions"
              >
                <HugeiconsIcon
                  icon={MoreHorizontalCircle01Icon}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuGroup>
                <DropdownMenuItem>Bulk email</DropdownMenuItem>
                <DropdownMenuItem>Export CSV</DropdownMenuItem>
                <DropdownMenuItem>Add contact</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

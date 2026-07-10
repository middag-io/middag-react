import { useState } from "react";

import { Checkbox } from "@/components/reui/checkbox";
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
} from "@hugeicons/core-free-icons";

const statuses = ["Pending", "Shipped", "Cancelled"] as const;

type Status = (typeof statuses)[number];

function toggleStatus(values: Status[], value: Status) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}

export function Pattern() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([]);

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
          placeholder="Search orders..."
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
                aria-label="Filter order status"
              >
                <HugeiconsIcon
                  icon={FilterIcon}
                  strokeWidth={2}
                  className="size-3.5"
                  aria-hidden="true"
                />
                Status
                {selectedStatuses.length > 0 ? (
                  <span className="text-muted-foreground tabular-nums">
                    {selectedStatuses.length}
                  </span>
                ) : null}
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-40 p-3">
              <div className="flex flex-col gap-2">
                {statuses.map((status) => (
                  <div key={status} className="flex items-center gap-2.5">
                    <Checkbox
                      id={`order-status-${status}`}
                      checked={selectedStatuses.includes(status)}
                      onCheckedChange={() =>
                        setSelectedStatuses((previous) =>
                          toggleStatus(previous, status),
                        )
                      }
                    />
                    <Label
                      htmlFor={`order-status-${status}`}
                      className="text-sm font-normal"
                    >
                      {status}
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

import { useEffect, useState } from "react";
import {
  DateSelector,
  formatDateValue,
  type DateSelectorValue,
} from "@/primitives/reui/date-selector";

import { Button } from "@/primitives/reui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/primitives/reui/dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar04Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  const [value, setValue] = useState<DateSelectorValue | undefined>();
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<
    DateSelectorValue | undefined
  >(value);

  const formattedValue = value ? formatDateValue(value) : "";
  const displayText = formattedValue || "Select a date";

  useEffect(() => {
    if (open) {
      setInternalValue(value);
    }
  }, [open, value]);

  const handleApply = () => {
    if (internalValue) {
      setValue(internalValue);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-56 justify-start">
          <HugeiconsIcon icon={Calendar04Icon} strokeWidth={2} />
          {displayText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Select Due Date</DialogTitle>
        </DialogHeader>

        <DateSelector
          value={internalValue}
          onChange={setInternalValue}
          showInput={true}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleApply}>Apply</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";

import { Button } from "@/components/reui/button";
import { Field, FieldDescription } from "@/components/reui/field";
import { Input } from "@/components/reui/input";
import { Label } from "@/components/reui/label";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon, PenIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState("My Awesome Project");

  return (
    <Field className="w-full max-w-xs">
      <Label htmlFor="label-inline-edit" className="gap-2">
        Project Name
        <Button
          size="icon-xs"
          variant="ghost"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <HugeiconsIcon
              icon={Tick02Icon}
              strokeWidth={2}
              className="size-3.5"
            />
          ) : (
            <HugeiconsIcon
              icon={PenIcon}
              strokeWidth={2}
              className="size-3.5"
            />
          )}
        </Button>
      </Label>
      {isEditing ? (
        <Input
          id="label-inline-edit"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />
      ) : (
        <FieldDescription>{value}</FieldDescription>
      )}
    </Field>
  );
}

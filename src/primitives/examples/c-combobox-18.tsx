"use client";

import { useState } from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/primitives/reui/combobox";
import { Field } from "@/primitives/reui/field";
import { HugeiconsIcon } from "@hugeicons/react";
import { UnfoldMoreIcon } from "@hugeicons/core-free-icons";

const frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"];

export function Pattern() {
  const [value, setValue] = useState<string | null>(null);

  return (
    <Field className="max-w-xs">
      <Combobox value={value} onValueChange={setValue} items={frameworks}>
        <ComboboxInput
          placeholder="Select framework"
          showTrigger={false}
          showClear={true}
        >
          {!value && (
            <ComboboxPrimitive.Trigger data-slot="combobox-trigger">
              <HugeiconsIcon
                icon={UnfoldMoreIcon}
                strokeWidth={2}
                className="text-muted-foreground pointer-events-none size-4"
              />
            </ComboboxPrimitive.Trigger>
          )}
        </ComboboxInput>
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  );
}

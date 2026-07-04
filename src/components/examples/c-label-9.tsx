"use client";

import { useState } from "react";

import { Field } from "@/components/reui/field";
import { Label } from "@/components/reui/label";
import { Textarea } from "@/components/reui/textarea";

export function Pattern() {
  const [length, setLength] = useState(0);

  return (
    <Field className="w-full max-w-xs">
      <Label htmlFor="label-counter" className="justify-between">
        Bio
        <span className="text-muted-foreground">{length}/200</span>
      </Label>
      <Textarea
        id="label-counter"
        placeholder="Tell us about yourself…"
        maxLength={200}
        onChange={(e) => setLength(e.target.value.length)}
      />
    </Field>
  );
}

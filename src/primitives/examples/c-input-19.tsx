import { useState } from "react";

import { Field, FieldLabel } from "@/primitives/reui/field";
import { Input } from "@/primitives/reui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewOffSlashIcon, ViewIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <Field className="w-full max-w-xs">
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor="password-link">Password</FieldLabel>
        <a
          href="#"
          className="text-primary text-xs font-medium hover:underline"
        >
          Forgot password?
        </a>
      </div>
      <div className="relative">
        <Input
          id="password-link"
          type={isVisible ? "text" : "password"}
          className="pe-9"
        />
        <button
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          onClick={toggleVisibility}
          type="button"
        >
          {isVisible ? (
            <HugeiconsIcon
              icon={ViewOffSlashIcon}
              strokeWidth={2}
              aria-hidden="true"
            />
          ) : (
            <HugeiconsIcon icon={ViewIcon} strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      </div>
    </Field>
  );
}

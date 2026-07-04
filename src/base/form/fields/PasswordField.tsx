/**
 * PasswordField -- password input with visibility toggle.
 *
 * Uses the ReUI Input with a button to toggle between masked and visible text.
 */

import { useState, type ReactElement } from "react";
import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/reui/button";
import { Input } from "@/components/reui/input";

export interface PasswordFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpTextId?: string;
  errorId?: string;
}

export function PasswordField({
  id,
  value,
  onChange,
  placeholder,
  disabled,
  required,
  error,
  helpTextId,
  errorId,
}: PasswordFieldProps): ReactElement {
  const [visible, setVisible] = useState(false);

  const describedBy =
    [error ? errorId : undefined, helpTextId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? "text" : "password"}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="pr-10"
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-foreground absolute top-0 right-0 h-full px-2.5"
        onClick={() => setVisible(!visible)}
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        <HugeiconsIcon icon={visible ? ViewOffIcon : ViewIcon} size={16} strokeWidth={2} />
      </Button>
    </div>
  );
}

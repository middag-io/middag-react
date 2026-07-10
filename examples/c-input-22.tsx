"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/utils";
import { Field, FieldLabel } from "@/components/reui/field";
import { Input } from "@/components/reui/input";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  InformationCircleIcon,
  CheckmarkCircle01Icon,
  Alert02Icon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  const id = useId();
  const [password, setPassword] = useState("");

  const getStrength = (pass: string) => {
    const requirements = [
      { met: pass.length >= 8, text: "8+ characters" },
      { met: /[0-9]/.test(pass), text: "a number" },
      { met: /[!@#$%^&*]/.test(pass), text: "a special character" },
    ];
    const metCount = requirements.filter((r) => r.met).length;
    return { requirements, metCount };
  };

  const { metCount } = getStrength(password);

  const getHint = () => {
    if (!password) {
      return "Use 8+ characters with a number and a special character.";
    }
    if (metCount === 3) {
      return "Strong password. You're all set!";
    }
    if (metCount === 2) {
      return "Almost there! Add the missing requirement.";
    }
    return "Weak password. Include 8+ characters, a number, and a special character.";
  };

  const getStatus = () => {
    if (!password)
      return {
        color: "text-muted-foreground",
        icon: (
          <HugeiconsIcon
            icon={InformationCircleIcon}
            strokeWidth={2}
            className="size-3.5 shrink-0"
          />
        ),
      };
    if (metCount === 3)
      return {
        color: "text-emerald-500",
        icon: (
          <HugeiconsIcon
            icon={CheckmarkCircle01Icon}
            strokeWidth={2}
            className="size-3.5 shrink-0"
          />
        ),
      };
    if (metCount === 2)
      return {
        color: "text-amber-500",
        icon: (
          <HugeiconsIcon
            icon={Alert02Icon}
            strokeWidth={2}
            className="size-3.5 shrink-0"
          />
        ),
      };
    return {
      color: "text-destructive",
      icon: (
        <HugeiconsIcon
          icon={Alert02Icon}
          strokeWidth={2}
          className="size-3.5 shrink-0"
        />
      ),
    };
  };

  const { color, icon: StatusIcon } = getStatus();

  return (
    <Field className="w-full max-w-xs">
      <FieldLabel htmlFor={id}>Password</FieldLabel>
      <Input
        id={id}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
      />
      <div
        className={cn(
          "flex items-center gap-2 text-xs transition-colors duration-200",
          color,
        )}
      >
        {StatusIcon}
        <p>{getHint()}</p>
      </div>
    </Field>
  );
}

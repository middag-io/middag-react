/**
 * OtpField -- one-time-password / verification code input (segmented slots).
 *
 * Wraps the ReUI InputOTP (input-otp) primitive. Slots are split into groups
 * separated by a divider when `groupSize` is set (e.g. 6 slots, group 3 → "•••-•••").
 */

import { Fragment, type ReactElement } from "react";
import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/primitives/reui/input-otp";

export interface OtpFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  pattern?: "digits" | "alphanumeric";
  groupSize?: number;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpTextId?: string;
  errorId?: string;
}

/** Split slot indices into groups for visual separators. */
function buildGroups(maxLength: number, groupSize?: number): number[][] {
  if (!groupSize || groupSize >= maxLength) {
    return [Array.from({ length: maxLength }, (_, i) => i)];
  }
  const groups: number[][] = [];
  for (let start = 0; start < maxLength; start += groupSize) {
    groups.push(
      Array.from({ length: Math.min(groupSize, maxLength - start) }, (_, i) => start + i),
    );
  }
  return groups;
}

export function OtpField({
  id,
  value,
  onChange,
  maxLength = 6,
  pattern = "digits",
  groupSize,
  disabled,
  required,
  error,
  helpTextId,
  errorId,
}: OtpFieldProps): ReactElement {
  const describedBy =
    [error ? errorId : undefined, helpTextId].filter(Boolean).join(" ") || undefined;
  const regexp = pattern === "alphanumeric" ? REGEXP_ONLY_DIGITS_AND_CHARS : REGEXP_ONLY_DIGITS;
  const groups = buildGroups(maxLength, groupSize);

  return (
    <InputOTP
      id={id}
      maxLength={maxLength}
      value={value ?? ""}
      onChange={onChange}
      pattern={regexp}
      disabled={disabled}
      aria-invalid={error ? true : undefined}
      aria-required={required || undefined}
      aria-describedby={describedBy}
    >
      {groups.map((group, groupIndex) => (
        <Fragment key={group[0]}>
          <InputOTPGroup>
            {group.map((slot) => (
              <InputOTPSlot key={slot} index={slot} aria-invalid={error ? true : undefined} />
            ))}
          </InputOTPGroup>
          {groupIndex < groups.length - 1 && <InputOTPSeparator />}
        </Fragment>
      ))}
    </InputOTP>
  );
}

/**
 * RatingField — star rating input using ReUI Rating component.
 */

import type { ReactElement } from "react";

import { Rating } from "@/primitives/reui/rating";

export interface RatingFieldProps {
  id: string;
  value: number | null;
  onChange: (value: number) => void;
  maxRating?: number;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpTextId?: string;
  errorId?: string;
}

export function RatingField({
  id,
  value,
  onChange,
  maxRating = 5,
  disabled,
  required,
  error,
  helpTextId,
  errorId,
}: RatingFieldProps): ReactElement {
  const describedBy =
    [error ? errorId : undefined, helpTextId].filter(Boolean).join(" ") || undefined;

  return (
    <div
      id={id}
      role="radiogroup"
      aria-required={required || undefined}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
    >
      <Rating
        rating={value ?? 0}
        maxRating={maxRating}
        editable={!disabled}
        showValue
        onRatingChange={onChange}
      />
    </div>
  );
}

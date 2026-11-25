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
  /** Id of the visible label (FormField renders it); names the group for assistive tech. */
  labelId?: string;
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
  labelId,
}: RatingFieldProps): ReactElement {
  const describedBy =
    [error ? errorId : undefined, helpTextId].filter(Boolean).join(" ") || undefined;

  return (
    <div
      id={id}
      role="radiogroup"
      aria-labelledby={labelId}
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

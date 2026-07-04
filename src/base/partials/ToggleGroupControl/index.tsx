/**
 * ToggleGroupControl — data-driven wrapper over the ReUI ToggleGroup primitive.
 *
 * A minimal, controlled segmented control for single- or multiple-selection.
 * The caller supplies an `options` array (values + already-translated labels)
 * and drives selection via `value`/`onValueChange` (controlled) or
 * `defaultValue` (uncontrolled). Kept product-agnostic: no entity coupling, no
 * data fetching — just selection. DataTable keeps its own DensityToggle.
 */

import { type ReactElement } from "react";

import { ToggleGroup, ToggleGroupItem } from "@/components/reui/toggle-group";
import { useTranslation } from "@/i18n/useTranslation";

export interface ToggleGroupOption {
  /** Submitted value; must be unique within the group. */
  value: string;
  /** Visible, already-translated label. */
  label: string;
  /** Accessible label when the visible label is an icon/glyph. Defaults to `label`. */
  ariaLabel?: string;
  disabled?: boolean;
}

interface ToggleGroupBaseProps {
  options: ToggleGroupOption[];
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  /** Accessible label for the group. Defaults to a translated built-in. */
  ariaLabel?: string;
  className?: string;
}

interface ToggleGroupSingleProps extends ToggleGroupBaseProps {
  type?: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

interface ToggleGroupMultipleProps extends ToggleGroupBaseProps {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

export type ToggleGroupControlProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;

export function ToggleGroupControl(props: ToggleGroupControlProps): ReactElement {
  const { t } = useTranslation();
  const { options, variant, size, ariaLabel, className } = props;
  const label = ariaLabel ?? t("middag.ui.toggle_group.label");

  const items = options.map((opt) => (
    <ToggleGroupItem
      key={opt.value}
      value={opt.value}
      disabled={opt.disabled}
      aria-label={opt.ariaLabel ?? opt.label}
    >
      {opt.label}
    </ToggleGroupItem>
  ));

  // Radix ToggleGroup is a discriminated union on `type`; branch so the
  // value/onValueChange signatures stay correctly typed without casts.
  if (props.type === "multiple") {
    return (
      <ToggleGroup
        type="multiple"
        value={props.value}
        defaultValue={props.defaultValue}
        onValueChange={props.onValueChange}
        variant={variant}
        size={size}
        aria-label={label}
        className={className}
      >
        {items}
      </ToggleGroup>
    );
  }

  return (
    <ToggleGroup
      type="single"
      value={props.value}
      defaultValue={props.defaultValue}
      onValueChange={props.onValueChange}
      variant={variant}
      size={size}
      aria-label={label}
      className={className}
    >
      {items}
    </ToggleGroup>
  );
}

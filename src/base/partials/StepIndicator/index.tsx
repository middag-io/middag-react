/**
 * StepIndicator — horizontal step progress bar for WizardLayout.
 *
 * Wraps ReUI Stepper in a read-only mode with server-driven step data.
 * Step data comes from layout.meta.steps (server-driven).
 *
 * Keyboard navigation is handled by ReUI Stepper (arrow keys, Home/End).
 */

import type { ReactElement } from "react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
} from "@/primitives/reui/stepper";

export interface StepItem {
  label: string;
  status: "completed" | "active" | "pending";
}

export function StepIndicator({ steps }: { steps: StepItem[] }): ReactElement {
  // Find the 1-based index of the active step (ReUI Stepper uses 1-based)
  const activeIndex = steps.findIndex((s) => s.status === "active") + 1 || 1;

  return (
    <Stepper
      value={activeIndex}
      orientation="horizontal"
      className="flex items-center justify-center"
      indicators={{
        completed: (
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon as unknown as IconSvgElement}
            className="size-4"
          />
        ),
      }}
    >
      {steps.map((step, index) => (
        <StepperItem
          key={step.label}
          step={index + 1}
          completed={step.status === "completed"}
          loading={false}
          disabled={step.status === "pending"}
          className="flex items-center"
        >
          <div className="flex flex-col items-center gap-1.5">
            <StepperIndicator />
            <StepperTitle className="text-xs whitespace-nowrap">{step.label}</StepperTitle>
          </div>
          {index < steps.length - 1 && <StepperSeparator className="mx-3" />}
        </StepperItem>
      ))}
    </Stepper>
  );
}

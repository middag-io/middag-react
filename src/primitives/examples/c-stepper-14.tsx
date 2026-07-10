"use client";

import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTrigger,
} from "@/primitives/reui/stepper";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon, Loading02Icon } from "@hugeicons/core-free-icons";

const steps = [1, 2, 3];

export function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <Stepper
        className="flex flex-col items-center justify-center gap-10"
        defaultValue={2}
        orientation="vertical"
        indicators={{
          completed: (
            <HugeiconsIcon
              icon={Tick02Icon}
              strokeWidth={2}
              className="size-3.5"
            />
          ),
          loading: (
            <HugeiconsIcon
              icon={Loading02Icon}
              strokeWidth={2}
              className="size-3.5 animate-spin"
            />
          ),
        }}
      >
        <StepperNav>
          {steps.map((step) => (
            <StepperItem key={step} step={step} loading={step === 2}>
              <StepperTrigger>
                <StepperIndicator className="data-[state=completed]:bg-success data-[state=completed]:text-white">
                  {step}
                </StepperIndicator>
              </StepperTrigger>
              {steps.length > step && (
                <StepperSeparator className="group-data-[state=completed]/step:bg-success" />
              )}
            </StepperItem>
          ))}
        </StepperNav>

        <StepperPanel className="w-56 text-center text-sm">
          {steps.map((step) => (
            <StepperContent key={step} value={step}>
              Step {step} content
            </StepperContent>
          ))}
        </StepperPanel>
      </Stepper>
    </div>
  );
}

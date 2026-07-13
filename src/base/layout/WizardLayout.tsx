/**
 * WizardLayout — renders the `wizard` template from page-contract.
 *
 * Server-driven: steps come from layout.meta.steps, actions from layout.meta.actions.
 * Content region renders standard blocks via BlockRegion.
 *
 * @see UI Layer Completion spec §1
 */

import type { ReactElement } from "react";

import { StepIndicator, type StepItem } from "@/base/partials/StepIndicator";
import { PageActionButton } from "@/base/shell/partials/PageActionButton";
import type { PageAction } from "@/contracts/page-contract";
import type { LayoutProps } from "@/engine/registries";

import { BlockRegion } from "./BlockRegion";

export function WizardLayout({ layout, renderBlock }: LayoutProps): ReactElement {
  const { regions, meta } = layout;
  const contentBlocks = regions.content ?? [];
  const steps = (meta?.steps ?? []) as StepItem[];
  const actions = (meta?.actions ?? []) as PageAction[];

  return (
    <div className="flex min-h-0 flex-col">
      {/* Step indicator bar */}
      {steps.length > 0 && (
        <div className="border-border border-b px-6 py-4">
          <StepIndicator steps={steps} />
        </div>
      )}

      {/* Content region */}
      <div className="flex-1 overflow-y-auto py-6">
        <BlockRegion blocks={contentBlocks} renderBlock={renderBlock} />
      </div>

      {/* Actions footer */}
      {actions.length > 0 && (
        <div className="border-border flex justify-end gap-2 border-t px-6 py-4">
          {actions.map((action) => (
            <PageActionButton key={action.id} action={action} />
          ))}
        </div>
      )}
    </div>
  );
}

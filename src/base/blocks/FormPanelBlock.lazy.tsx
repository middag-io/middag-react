/**
 * FormPanelBlock.lazy — Suspense wrapper that code-splits the heavy form_panel block.
 *
 * react-hook-form + zod (+ @hookform/resolvers) load only when a page actually
 * renders a form_panel. register-defaults registers THIS wrapper, not the heavy
 * module, keeping the engine's base bundle lean (mirrors the field lazies in
 * FormField.tsx).
 */

import { lazy, Suspense, type ReactElement } from "react";

import type { BlockProps } from "@/app/registries";
import { Skeleton } from "@/components/reui/skeleton";
import type { FormPanelBlockData } from "@/contracts/block-data";

const LazyFormPanelBlock = lazy(() =>
  import("@/base/blocks/FormPanelBlock").then((m) => ({ default: m.FormPanelBlock })),
);

/** Form-shaped placeholder shown while the heavy form_panel chunk loads. */
function FormSkeleton(): ReactElement {
  return (
    <div className="mx-auto max-w-[720px] space-y-6">
      <Skeleton className="h-9 w-full rounded-md" />
      <Skeleton className="h-9 w-full rounded-md" />
      <Skeleton className="h-24 w-full rounded-md" />
      <Skeleton className="h-9 w-40 rounded-md" />
    </div>
  );
}

export function FormPanelBlockLazy(props: BlockProps<FormPanelBlockData>): ReactElement {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <LazyFormPanelBlock {...props} />
    </Suspense>
  );
}

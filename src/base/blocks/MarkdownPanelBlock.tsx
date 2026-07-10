/**
 * MarkdownPanelBlock — renders sanitized markdown content in a Card.
 *
 * Delegates to MarkdownContent partial when available.
 * Stub renders raw content in a prose-style container.
 *
 * @see NV-05-ux-blocks.md §8
 */

import { lazy, Suspense, type ReactElement } from "react";

import type { MarkdownPanelBlockData } from "@/contracts/block-data";
import type { BlockProps } from "@/engine/registries";
import { renderLabel } from "@/i18n/render-label";
import { useTranslation } from "@/i18n/useTranslation";
import { Card, CardContent, CardHeader, CardTitle } from "@/primitives/reui/card";
import { Skeleton } from "@/primitives/reui/skeleton";

// Lazy load MarkdownContent to keep bundle small (react-markdown ~55KB)
const MarkdownContent = lazy(() =>
  import("@/base/partials/MarkdownContent").then((m) => ({
    default: m.MarkdownContent,
  })),
);

function MarkdownSkeleton(): ReactElement {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-[90%]" />
      <Skeleton className="h-4 w-[75%]" />
      <Skeleton className="h-4 w-[85%]" />
      <Skeleton className="h-4 w-[60%]" />
    </div>
  );
}

export function MarkdownPanelBlock({ block }: BlockProps<MarkdownPanelBlockData>): ReactElement {
  const { t } = useTranslation();
  const { data, title, meta } = block;
  const isLoading = meta?.loading === true;

  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle className="text-xl font-semibold">{renderLabel(title, t)}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-6">
        {isLoading ? (
          <MarkdownSkeleton />
        ) : (
          <Suspense fallback={<MarkdownSkeleton />}>
            <MarkdownContent content={data.content} maxHeight={data.maxHeight} />
          </Suspense>
        )}
      </CardContent>
    </Card>
  );
}

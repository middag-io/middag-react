/**
 * LazyBlock — wrapper that loads a block's data from a separate Inertia prop
 * instead of embedding it in the PageContract.
 *
 * The prop name lives in `block.meta.lazyProp`; that name is the wire token
 * (the top-level page prop, i.e. the `<Deferred data>` / `only:[…]` key). The
 * data is fetched with a native Inertia primitive:
 *
 * - `block.meta.whenVisible === true` → `<WhenVisible>`: fetched when the block
 *   scrolls into the viewport (optional `meta.buffer` in px). Best for
 *   below-the-fold blocks.
 * - otherwise → `<Deferred>`: Inertia auto-fetches the deferred prop right after
 *   the page mounts (the backend marks it with `Inertia::defer()`, which the
 *   contract surfaces as `block.deferred`).
 *
 * Both strategies read the resolved data back from `usePage().props[lazyProp]`.
 * If the prop is already present on first load, the primitive renders the block
 * immediately without an extra request.
 */

import type { ComponentType, ReactElement } from "react";
import { Deferred, usePage, WhenVisible } from "@inertiajs/react";

import type { BlockProps } from "@/app/registries";
import type { BlockDescriptor } from "@/contracts/page-contract";

interface LazyBlockProps {
  block: BlockDescriptor;
  Component: ComponentType<BlockProps<Record<string, unknown>>>;
}

interface LazyStrategyProps extends LazyBlockProps {
  lazyProp: string;
}

/** Skeleton shown while a lazy block's data is loading. */
function LazyFallback(): ReactElement {
  return (
    <div className="animate-pulse space-y-2">
      <div className="bg-muted h-4 w-1/3 rounded" />
      <div className="bg-muted h-32 rounded" />
    </div>
  );
}

/**
 * Reads the resolved lazy prop from the page and renders the block with it.
 * Only mounted by `<Deferred>`/`<WhenVisible>` once the prop has arrived.
 */
function LazyBlockContent({ block, Component, lazyProp }: LazyStrategyProps): ReactElement {
  const pageProps = usePage().props as Record<string, unknown>;
  const lazyData = pageProps[lazyProp];

  return <Component block={{ ...block, data: lazyData as Record<string, unknown> }} />;
}

export function LazyBlock({ block, Component }: LazyBlockProps): ReactElement {
  const lazyProp = block.meta?.lazyProp as string | undefined;

  // No prop name → render eagerly (defensive; isLazyBlock should gate this).
  if (!lazyProp) {
    return <Component block={block} />;
  }

  // Viewport-triggered: fetch the prop when the block scrolls into view.
  if (block.meta?.whenVisible === true) {
    const buffer = typeof block.meta?.buffer === "number" ? block.meta.buffer : undefined;
    return (
      <WhenVisible data={lazyProp} buffer={buffer} fallback={<LazyFallback />}>
        <LazyBlockContent block={block} Component={Component} lazyProp={lazyProp} />
      </WhenVisible>
    );
  }

  // Default: deferred prop, auto-fetched by Inertia after mount.
  return (
    <Deferred data={lazyProp} fallback={<LazyFallback />}>
      <LazyBlockContent block={block} Component={Component} lazyProp={lazyProp} />
    </Deferred>
  );
}

/**
 * Check if a block descriptor uses lazy loading.
 *
 * Keyed on `meta.lazyProp` (the wire token / prop name) — `deferred` and
 * `whenVisible` only select the loading strategy and are inert without it.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function isLazyBlock(block: BlockDescriptor): boolean {
  return typeof block.meta?.lazyProp === "string";
}

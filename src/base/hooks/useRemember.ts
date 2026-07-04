/**
 * useRemember — useState that survives Inertia history navigation when opted in.
 *
 * Wraps Inertia v3's `useRemember` so a block's client-only UI state (column
 * visibility, density, draft selections — state that is NOT round-tripped to
 * the server) is restored on browser back/forward within the SPA. Gated by the
 * `remember` flag the backend sets on `BlockDescriptor`: when off, it behaves
 * as a plain `useState`, so non-opted-in blocks pay nothing and keep the same
 * wire shape.
 *
 * Drop-in for `useState`: same `[state, setState]` tuple, same lazy-initializer
 * support. The `key` scopes Inertia's history slot — keep it stable and unique
 * per block (use `block.key`).
 *
 * IMPORTANT: `enabled` must be stable for the lifetime of the component. It is
 * derived from the contract (`block.remember`), which does not change across
 * renders of a mounted block. A flipping `enabled` would swap which underlying
 * state backs the tuple and desync the value.
 *
 * @example
 * ```tsx
 * const [visibility, setVisibility] = useRemember(
 *   () => buildInitialVisibility(columns),
 *   `${block.key}:columns`,
 *   block.remember ?? false,
 * );
 * ```
 */

import { useState, type Dispatch, type SetStateAction } from "react";
import { useRemember as useInertiaRemember } from "@inertiajs/react";

export function useRemember<T>(
  initialState: T | (() => T),
  key: string,
  enabled: boolean,
): [T, Dispatch<SetStateAction<T>>] {
  // Freeze `enabled` for the component's lifetime. The branch below calls a
  // different hook per path, which Rules of Hooks forbids *if the branch can
  // change between renders*. Freezing makes the branch constant for this mount,
  // so hook order is stable at runtime; the static linter cannot prove that, so
  // the calls are explicitly exempted. A block's `remember` flag is
  // contract-stable; a flip would only take effect on remount.
  const [persist] = useState(enabled);
  // Resolve the (possibly lazy) initial value exactly once, before the branch.
  const [initial] = useState<T>(initialState);

  if (persist) {
    // Inertia's useRemember reaches into the router's history layer, which only
    // exists once a host bootstraps `createInertiaApp`. Calling it ONLY on the
    // opted-in path keeps mock/SSR/unit environments (remember=false) free of
    // that dependency.
    // eslint-disable-next-line react-hooks/rules-of-hooks -- `persist` is frozen; branch is constant per mount
    return useInertiaRemember<T>(initial, key);
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks -- see above
  return useState<T>(initial);
}

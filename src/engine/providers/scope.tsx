/**
 * ScopeProvider — React context for global scope data.
 *
 * Reads the `scope` Inertia shared prop serialized by http_kernel from
 * global_scope_manager. Extensions add their scope data during boot().
 *
 * @see classes/framework/kernel/manager/global_scope_manager.php
 * @see NV-05-ux-shell-sidebar.md §1.3
 */

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { usePage } from "@inertiajs/react";

import type { SharedProps } from "@/contracts/shared-props";

/** Scope context value — dynamic keys registered by PHP extensions via boot() */
export type ScopeContextValue = Record<string, unknown>;

const ScopeContext = createContext<ScopeContextValue>({});

export function ScopeProvider({ children }: { children: ReactNode }) {
  const { props } = usePage<SharedProps>();
  const scope = useMemo(() => props.scope ?? {}, [props.scope]);

  return <ScopeContext.Provider value={scope}>{children}</ScopeContext.Provider>;
}

/**
 * Access global scope data in any component.
 * Returns the full scope object — components read specific keys.
 *
 * @example
 * const scope = useScope();
 * const orgId = scope.organization?.id;
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useScope(): ScopeContextValue {
  return useContext(ScopeContext);
}

/**
 * Type-safe scope accessor for known scope keys.
 *
 * @example
 * const org = useScopeKey<{ id: number; name: string; slug: string }>('organization');
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useScopeKey<T>(key: string): T | undefined {
  const scope = useScope();
  return scope[key] as T | undefined;
}

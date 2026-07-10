/**
 * AuthProvider — React context for authenticated user data and capability checks.
 *
 * Reads auth from Inertia shared props populated by inertia_shared_props.php.
 *
 * @see NV-05-ux-shell-sidebar.md §1.3
 */

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { usePage } from "@inertiajs/react";

import type { SharedProps } from "@/contracts/shared-props";

interface AuthContextValue {
  /** Authenticated user, or null on guest pages (no `auth` shared prop). */
  user: { id: number; name: string; email: string; avatarUrl?: string } | null;
  capabilities: string[];
  can: (capability: string) => boolean;
  /** True when an authenticated user is present. False for guests. */
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { props } = usePage<SharedProps>();
  // `auth` is optional/null on guest-facing pages (login). Tolerate its absence
  // instead of dereferencing it — a missing user is a valid state, not a crash.
  const auth = props.auth ?? null;

  const value = useMemo<AuthContextValue>(() => {
    if (!auth) {
      return {
        user: null,
        capabilities: [],
        can: () => false,
        isAuthenticated: false,
      };
    }
    const capabilities = auth.capabilities ?? [];
    return {
      user: {
        id: auth.id,
        name: auth.name,
        email: auth.email,
        avatarUrl: auth.avatarUrl,
      },
      capabilities,
      can: (cap: string) => capabilities.includes(cap),
      isAuthenticated: true,
    };
  }, [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Access authenticated user and capability check function.
 *
 * @example
 * const { user, can } = useAuth();
 * if (can('local/middag:manage')) { ... }
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      "[@middag-io/react] useAuth must be used within <AuthProvider>. " +
        "Wrap your app root with <AuthProvider>. " +
        "Docs: https://ui-docs.middag.io/guides/providers",
    );
  }
  return ctx;
}

/** Render children only if user has the capability. */
export function Can({ capability, children }: { capability: string; children: ReactNode }) {
  const { can } = useAuth();
  return can(capability) ? <>{children}</> : null;
}

/** Render children only if user does NOT have the capability. */
export function Cannot({ capability, children }: { capability: string; children: ReactNode }) {
  const { can } = useAuth();
  return can(capability) ? null : <>{children}</>;
}

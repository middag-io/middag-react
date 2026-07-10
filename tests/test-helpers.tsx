/**
 * Shared test helpers — mock Inertia usePage and provider wrappers.
 *
 * Used by shell render tests, provider tests, and layout smoke tests.
 */

import type { ReactNode } from "react";

import type { SharedProps } from "@/contracts/shared-props";

/** Minimal SharedProps that satisfy all providers. */
// eslint-disable-next-line react-refresh/only-export-components
export const MOCK_SHARED_PROPS: SharedProps = {
  navigation: {
    activeKey: "dashboard",
    tree: [
      {
        key: "dashboard",
        label: "Dashboard",
        href: "/",
        icon: "home",
        children: [],
      },
    ],
    footer: [],
  },
  auth: {
    id: 1,
    name: "Test User",
    email: "test@example.com",
    capabilities: ["local/middag:view", "local/middag:manage"],
  },
  theme: {
    strings: { "middag.ui.confirm": "Confirm (server)" },
    appearance: "light",
  },
  flash: {},
  locale: "en",
  version: "0.0.0-test",
  scope: { organization: { id: 1, name: "Test Org" } },
};

/** Build SharedProps with a contract embedded (for shell/layout tests). */
// eslint-disable-next-line react-refresh/only-export-components
export function propsWithContract(
  contract: Record<string, unknown>,
  overrides?: Partial<SharedProps>,
): SharedProps & { contract: Record<string, unknown> } {
  return {
    ...MOCK_SHARED_PROPS,
    ...overrides,
    contract,
  } as SharedProps & { contract: Record<string, unknown> };
}

/**
 * Wrapper that provides I18n + Auth + Scope + Flash context.
 *
 * Must be used AFTER vi.mock('@inertiajs/react') is set up in the test file.
 */
export function AllProviders({ children }: { children: ReactNode }) {
  // Dynamic imports to avoid circular deps with mocked modules
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { I18nProvider } = require("@/i18n/I18nProvider");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { AuthProvider } = require("@/engine/providers/auth");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { ScopeProvider } = require("@/engine/providers/scope");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { FlashProvider } = require("@/engine/providers/flash");

  return (
    <I18nProvider>
      <AuthProvider>
        <ScopeProvider>
          <FlashProvider>{children}</FlashProvider>
        </ScopeProvider>
      </AuthProvider>
    </I18nProvider>
  );
}

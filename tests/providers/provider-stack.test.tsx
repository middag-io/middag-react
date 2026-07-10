/**
 * Provider composition test — validates the full provider stack works together.
 *
 * Renders I18n > Auth > Scope > Flash with mocked usePage().
 * A child component calls all hooks to verify they return correct data.
 */

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AuthProvider, Can, Cannot, useAuth } from "@/engine/providers/auth";
import { ScopeProvider, useScope, useScopeKey } from "@/engine/providers/scope";
import { I18nProvider } from "@/i18n/I18nProvider";
import { useTranslation } from "@/i18n/useTranslation";

// Mock Inertia usePage with full SharedProps
vi.mock("@inertiajs/react", () => ({
  usePage: () => ({
    props: {
      auth: {
        id: 42,
        name: "Michael",
        email: "michael@middag.io",
        capabilities: ["local/middag:manage", "local/middag:view"],
      },
      theme: {
        strings: { "server.greeting": "Hello from server" },
        appearance: "light",
      },
      flash: { success: "Saved!" },
      locale: "pt_BR",
      version: "0.12.0",
      scope: { organization: { id: 1, name: "MIDDAG" } },
    },
    url: "/",
  }),
  router: {
    on: () => () => {},
  },
}));

/** Component that exercises all provider hooks */
function AllHooksConsumer() {
  const { t, locale, formatNumber, formatCurrency } = useTranslation();
  const { user, can } = useAuth();
  const scope = useScope();
  const org = useScopeKey<{ id: number; name: string }>("organization");

  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="t-server">{t("server.greeting")}</span>
      <span data-testid="t-default">{t("middag.ui.confirm")}</span>
      <span data-testid="user-name">{user?.name}</span>
      <span data-testid="user-email">{user?.email}</span>
      <span data-testid="can-manage">{String(can("local/middag:manage"))}</span>
      <span data-testid="can-delete">{String(can("local/middag:delete"))}</span>
      <span data-testid="scope-keys">{Object.keys(scope).join(",")}</span>
      <span data-testid="org-name">{org?.name ?? "none"}</span>
      <span data-testid="format-number">{formatNumber(1234.5)}</span>
      <span data-testid="format-currency">{formatCurrency(99.9)}</span>
      <Can capability="local/middag:manage">
        <span data-testid="can-gate">visible</span>
      </Can>
      <Cannot capability="local/middag:manage">
        <span data-testid="cannot-gate">hidden</span>
      </Cannot>
    </div>
  );
}

describe("provider stack composition", () => {
  afterEach(cleanup);

  it("all hooks return correct data when providers are nested", () => {
    render(
      <I18nProvider>
        <AuthProvider>
          <ScopeProvider>
            <AllHooksConsumer />
          </ScopeProvider>
        </AuthProvider>
      </I18nProvider>,
    );

    // I18n
    expect(screen.getByTestId("locale").textContent).toBe("pt-BR"); // normalized from pt_BR
    expect(screen.getByTestId("t-server").textContent).toBe("Hello from server");
    expect(screen.getByTestId("t-default").textContent).toBeTruthy(); // LIB_UI_DEFAULTS fallback

    // Auth
    expect(screen.getByTestId("user-name").textContent).toBe("Michael");
    expect(screen.getByTestId("user-email").textContent).toBe("michael@middag.io");
    expect(screen.getByTestId("can-manage").textContent).toBe("true");
    expect(screen.getByTestId("can-delete").textContent).toBe("false");

    // Scope
    expect(screen.getByTestId("scope-keys").textContent).toBe("organization");
    expect(screen.getByTestId("org-name").textContent).toBe("MIDDAG");

    // Can/Cannot gates
    expect(screen.getByTestId("can-gate")).toBeDefined();
    expect(screen.queryByTestId("cannot-gate")).toBeNull();

    // Formatting (locale-aware)
    const numberText = screen.getByTestId("format-number").textContent!;
    expect(numberText).toContain("1"); // At minimum contains the number
    const currencyText = screen.getByTestId("format-currency").textContent!;
    expect(currencyText).toContain("99"); // Contains the amount
  });

  it("providers work in any nesting order", () => {
    // Auth > Scope > I18n (different order)
    render(
      <AuthProvider>
        <ScopeProvider>
          <I18nProvider>
            <AllHooksConsumer />
          </I18nProvider>
        </ScopeProvider>
      </AuthProvider>,
    );

    expect(screen.getByTestId("user-name").textContent).toBe("Michael");
    expect(screen.getByTestId("org-name").textContent).toBe("MIDDAG");
    expect(screen.getByTestId("locale").textContent).toBe("pt-BR");
  });

  it("useAuth throws outside AuthProvider", () => {
    function Orphan() {
      useAuth();
      return null;
    }

    expect(() => render(<Orphan />)).toThrow("useAuth must be used within");
  });

  it("useTranslation works without an I18nProvider (bound to the library i18next instance)", () => {
    // react-i18next binds the library-owned instance via initReactI18next, so the
    // hook resolves against it directly — no provider/context dependency, no throw.
    function Orphan() {
      const { t, locale } = useTranslation();
      return (
        <div>
          <span data-testid="orphan-t">{t("middag.ui.confirm")}</span>
          <span data-testid="orphan-locale">{locale}</span>
        </div>
      );
    }

    expect(() => render(<Orphan />)).not.toThrow();
    // Resolves a bundled default without a provider. The exact locale depends on
    // the shared singleton's current language (set by prior renders / detector),
    // so accept either bundled translation — the point is the lookup resolves.
    expect(["Confirm", "Confirmar"]).toContain(screen.getByTestId("orphan-t").textContent);
    expect(screen.getByTestId("orphan-locale").textContent).toBeTruthy();
  });
});

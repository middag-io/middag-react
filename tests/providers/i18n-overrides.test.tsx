/**
 * I18nProvider server-strings merge — validates the new i18next-based provider:
 *   server theme.strings override the bundled UI catalog (server wins), the
 *   server locale is normalized and applied, and missing keys degrade to the key.
 *
 * The old `overrides` prop and the flat LIB_UI_DEFAULTS / ptBR catalogs were
 * removed in the no-retrocompat swap; the equivalent override path is now the
 * server-preloaded `theme.strings` bundle merged into the 'ui' namespace.
 */

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { I18nProvider } from "@/i18n/I18nProvider";
import { useTranslation } from "@/i18n/useTranslation";

// Mock Inertia usePage — server preloads one override for a bundled key plus a
// brand-new key, and sends a pt-BR locale.
vi.mock("@inertiajs/react", () => ({
  usePage: () => ({
    props: {
      theme: {
        strings: {
          "server.key": "From Server",
          // Override a key that also exists in the bundled catalog.
          "middag.ui.confirm": "Override Confirm",
        },
      },
      locale: "pt-BR",
    },
    url: "/",
  }),
  router: { on: () => () => {} },
}));

/** Test component that displays translated text */
function DisplayKey({ k }: { k: string }) {
  const { t } = useTranslation();
  return <span data-testid={k}>{t(k)}</span>;
}

describe("I18nProvider server-strings merge", () => {
  afterEach(cleanup);

  it("server strings resolve for keys not present in the bundled catalog", () => {
    render(
      <I18nProvider>
        <DisplayKey k="server.key" />
      </I18nProvider>,
    );

    expect(screen.getByTestId("server.key").textContent).toBe("From Server");
  });

  it("server strings override bundled UI defaults (server wins)", () => {
    render(
      <I18nProvider>
        <DisplayKey k="middag.ui.confirm" />
      </I18nProvider>,
    );

    // Server-preloaded value beats the bundled "Confirmar"/"Confirm".
    expect(screen.getByTestId("middag.ui.confirm").textContent).toBe("Override Confirm");
  });

  it("bundled pt-BR catalog resolves for non-overridden keys", () => {
    render(
      <I18nProvider>
        <DisplayKey k="middag.ui.cancel" />
      </I18nProvider>,
    );

    // Server locale is pt-BR and cancel is not overridden → bundled pt-BR value.
    expect(screen.getByTestId("middag.ui.cancel").textContent).toBe("Cancelar");
  });

  it("unknown keys fall back to the key itself", () => {
    render(
      <I18nProvider>
        <DisplayKey k="nonexistent.key.xyz" />
      </I18nProvider>,
    );

    expect(screen.getByTestId("nonexistent.key.xyz").textContent).toBe("nonexistent.key.xyz");
  });

  it("locale is normalized and applied from server props", () => {
    function DisplayLocale() {
      const { locale } = useTranslation();
      return <span data-testid="locale">{locale}</span>;
    }

    render(
      <I18nProvider>
        <DisplayLocale />
      </I18nProvider>,
    );

    // Server sends "pt-BR"; provider normalizes + applies it.
    expect(screen.getByTestId("locale").textContent).toBe("pt-BR");
  });
});

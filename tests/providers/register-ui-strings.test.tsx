/**
 * registerUiStrings — add-on packages (e.g. @middag-io/react-pro) contribute
 * default UI strings at runtime, now via a by-locale map. Contributed strings
 * merge into the 'ui' namespace and resolve through the i18next lookup; the
 * server-preloaded theme.strings still win (applied later, with overwrite).
 */

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { I18nProvider } from "@/i18n/I18nProvider";
import { i18n } from "@/i18n/instance";
import { registerUiStrings } from "@/i18n/register-strings";
import { useTranslation } from "@/i18n/useTranslation";

// Mock Inertia usePage — one server string, locale "en".
vi.mock("@inertiajs/react", () => ({
  usePage: () => ({
    props: {
      theme: { strings: { "pro.test.server": "From Server" } },
      locale: "en",
    },
    url: "/",
  }),
  router: { on: () => () => {} },
}));

function DisplayKey({ k }: { k: string }) {
  const { t } = useTranslation();
  return <span data-testid={k}>{t(k)}</span>;
}

describe("registerUiStrings", () => {
  // Force the shared singleton to "en" so contributed en strings resolve
  // regardless of locale left over from previously-run suites.
  beforeAll(async () => {
    await i18n.changeLanguage("en");
  });
  afterEach(cleanup);

  it("contributed strings resolve as defaults (by-locale map)", () => {
    registerUiStrings({ en: { "pro.test.contributed": "Contributed Value" } });

    render(
      <I18nProvider>
        <DisplayKey k="pro.test.contributed" />
      </I18nProvider>,
    );

    expect(screen.getByTestId("pro.test.contributed").textContent).toBe("Contributed Value");
  });

  it("is idempotent and merges across calls", () => {
    registerUiStrings({ en: { "pro.test.a": "A" } });
    registerUiStrings({ en: { "pro.test.b": "B" } });

    render(
      <I18nProvider>
        <DisplayKey k="pro.test.a" />
        <DisplayKey k="pro.test.b" />
      </I18nProvider>,
    );

    expect(screen.getByTestId("pro.test.a").textContent).toBe("A");
    expect(screen.getByTestId("pro.test.b").textContent).toBe("B");
  });

  it("registers strings for multiple locales at once", () => {
    registerUiStrings({
      en: { "pro.test.multi": "Multi EN" },
      "pt-BR": { "pro.test.multi": "Multi PT" },
    });

    render(
      <I18nProvider>
        <DisplayKey k="pro.test.multi" />
      </I18nProvider>,
    );

    // Singleton is "en" for this suite.
    expect(screen.getByTestId("pro.test.multi").textContent).toBe("Multi EN");
  });

  it("server strings take precedence over contributed defaults", () => {
    registerUiStrings({ en: { "pro.test.server": "Contributed Attempt" } });

    render(
      <I18nProvider>
        <DisplayKey k="pro.test.server" />
      </I18nProvider>,
    );

    // Server theme.strings are merged with overwrite by the provider → server wins.
    expect(screen.getByTestId("pro.test.server").textContent).toBe("From Server");
  });

  it("unknown keys still fall back to the key itself", () => {
    render(
      <I18nProvider>
        <DisplayKey k="pro.test.unknown.xyz" />
      </I18nProvider>,
    );

    expect(screen.getByTestId("pro.test.unknown.xyz").textContent).toBe("pro.test.unknown.xyz");
  });
});

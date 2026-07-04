import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { I18nProvider } from "@/i18n/I18nProvider";
import { i18nReady } from "@/i18n/instance";
import { useTranslation } from "@/i18n/useTranslation";

// Mock Inertia usePage BEFORE importing the provider.
vi.mock("@inertiajs/react", () => ({
  usePage: () => ({
    props: { locale: "pt_BR", theme: { strings: { "middag.ui.shell.skip_to_content": "Pular" } } },
  }),
}));

function Probe() {
  const { t, locale } = useTranslation();
  return <span data-testid="out">{`${locale}|${t("middag.ui.shell.skip_to_content")}`}</span>;
}

describe("I18nProvider", () => {
  it("normalizes server locale and merges server strings (server wins)", async () => {
    await i18nReady;
    render(
      <I18nProvider>
        <Probe />
      </I18nProvider>,
    );
    await waitFor(() => expect(screen.getByTestId("out").textContent).toBe("pt-BR|Pular"));
  });
});

import { I18nextProvider } from "react-i18next";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { i18n, i18nReady } from "@/i18n/instance";
import { useTranslation } from "@/i18n/useTranslation";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
);

describe("useTranslation (lib)", () => {
  it("exposes t, locale and Intl formatters", async () => {
    await i18nReady;
    await i18n.changeLanguage("pt-BR");
    const { result } = renderHook(() => useTranslation(), { wrapper });

    expect(typeof result.current.t).toBe("function");
    expect(result.current.locale).toBe("pt-BR");
    expect(result.current.formatCurrency(10)).toMatch(/R\$/);
    expect(result.current.formatNumber(1000)).toBe("1.000");
  });
});

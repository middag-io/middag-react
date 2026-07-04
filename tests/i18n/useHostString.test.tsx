import { I18nextProvider } from "react-i18next";
import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { setHostStringResolver } from "@/i18n/host-resolver";
import { i18n, i18nReady } from "@/i18n/instance";
import { useHostString } from "@/i18n/useHostString";

function Probe({ k, c }: { k: string; c: string }) {
  return <span data-testid="out">{useHostString(k, c)}</span>;
}

afterEach(() => setHostStringResolver(null));

describe("useHostString", () => {
  it("returns the key first, then the lazily-resolved raw host string", async () => {
    await i18nReady;
    const resolver = vi.fn(async () => "Nome do curso"); // Moodle get_string result (server-final, raw)
    setHostStringResolver(resolver);

    render(
      <I18nextProvider i18n={i18n}>
        <Probe k="coursename" c="mod_unidade" />
      </I18nextProvider>,
    );

    // first paint: key (not yet resolved)
    expect(screen.getByTestId("out").textContent).toBe("coursename");
    // after async resolve + 'added' re-render: raw value, NOT interpolated
    await waitFor(() => expect(screen.getByTestId("out").textContent).toBe("Nome do curso"));
    expect(resolver).toHaveBeenCalledOnce();
  });
});

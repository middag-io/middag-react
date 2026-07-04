/**
 * ContractPage diagnostics (E5.1 / F-08). The shell → layout → block fallbacks
 * render an accessible, translated diagnostic instead of a hardcoded-English
 * panel or a white screen. Each diagnostic carries role="alert" and its message
 * comes from the `ui` i18n bundle (asserted in EN + PT-BR). The verbose detail
 * (offending type, per-field validation list) is DEV-only and not asserted here.
 */

import type { ReactElement } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import "../setup";

import { ContractPage } from "@/app/ContractPage";
import type { LayoutProps, ShellProps } from "@/app/registries";
import { registerLayout, registerShell } from "@/app/registries";
import type { PageContract } from "@/contracts/page-contract";
import { I18nProvider } from "@/i18n/I18nProvider";
import { i18n } from "@/i18n/instance";

import { mockUsePage } from "../setup";

// A transparent shell + a layout that just renders the content region's blocks,
// so a contract can reach renderBlock's unknown-block branch deterministically.
function PassthroughShell({ children }: ShellProps): ReactElement {
  return <div data-testid="shell">{children}</div>;
}
function BlockLayout({ layout, renderBlock }: LayoutProps): ReactElement {
  const content = (layout.regions?.content ?? []) as Parameters<typeof renderBlock>[0][];
  return <div>{content.map((block) => renderBlock(block))}</div>;
}

function validContract(over: Partial<PageContract> = {}): PageContract {
  return {
    version: "1",
    shell: "test-shell",
    page: { key: "t", title: "T", breadcrumbs: [] },
    layout: { template: "test-layout", regions: { content: [] } },
    ...over,
  } as PageContract;
}

function renderPage(contract: unknown, locale = "en") {
  mockUsePage.mockReturnValue({
    props: {
      theme: { appearance: "light", strings: {} },
      flash: {},
      locale,
      version: "0.0.0-test",
      scope: {},
    },
    url: "/test",
  });
  return render(
    <I18nProvider>
      <ContractPage contract={contract as PageContract} />
    </I18nProvider>,
  );
}

describe("ContractPage diagnostics", () => {
  beforeAll(() => {
    registerShell("test-shell", PassthroughShell);
    registerLayout("test-layout", BlockLayout);
  });

  afterEach(async () => {
    cleanup();
    // The i18next instance is a module singleton; reset so a pt-BR test does not
    // leak its language into the next test.
    await i18n.changeLanguage("en");
  });

  afterAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("renders an accessible, translated alert for an unknown block type", async () => {
    renderPage(
      validContract({
        layout: {
          template: "test-layout",
          regions: { content: [{ type: "ghost_block", key: "b1", data: {} }] },
        },
      } as Partial<PageContract>),
    );
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Unknown block type:");
  });

  it("translates the unknown-block diagnostic to pt-BR", async () => {
    renderPage(
      validContract({
        layout: {
          template: "test-layout",
          regions: { content: [{ type: "ghost_block", key: "b1", data: {} }] },
        },
      } as Partial<PageContract>),
      "pt-BR",
    );
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Tipo de bloco desconhecido:");
  });

  it("renders an alert with the translated headline for an invalid contract", async () => {
    renderPage({});
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Invalid page contract.");
  });

  it("translates the invalid-contract headline to pt-BR", async () => {
    renderPage({}, "pt-BR");
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Contrato de página inválido.");
  });

  it("renders a translated alert for an unknown shell", async () => {
    renderPage(validContract({ shell: "ghost_shell" }));
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Unknown shell:");
  });

  it("renders a translated alert for an unknown layout template", async () => {
    // Shell resolves (test-shell); the layout template + the "stack" fallback are
    // both unregistered in this suite, so the layout diagnostic renders.
    renderPage(validContract({ layout: { template: "ghost_layout", regions: { content: [] } } }));
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Unknown layout template:");
  });
});

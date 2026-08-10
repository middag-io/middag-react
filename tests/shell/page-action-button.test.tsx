import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import "../setup";

import type { PageAction } from "@/contracts/page-contract";

function action(over: Partial<PageAction> = {}): PageAction {
  return {
    id: "act",
    label: "Do it",
    intent: "secondary",
    target: { kind: "link", href: "/somewhere" },
    ...over,
  } as PageAction;
}

describe("PageActionButton", () => {
  afterEach(() => {
    cleanup();
  });

  it("draws the action's icon when the registry knows the name", async () => {
    const { PageActionButton } = await import("@/base/shell/partials/PageActionButton");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const { registerDefaultIcons } = await import("@/base/utils/register-default-icons");
    registerDefaultIcons();

    const { container } = render(
      <I18nProvider>
        <PageActionButton action={action({ icon: "trash" })} />
      </I18nProvider>,
    );

    expect(screen.getByText("Do it")).toBeDefined();
    expect(container.querySelectorAll("svg").length).toBe(1);
  });

  it("draws nothing for an unregistered icon name", async () => {
    const { PageActionButton } = await import("@/base/shell/partials/PageActionButton");
    const { I18nProvider } = await import("@/i18n/I18nProvider");

    const { container } = render(
      <I18nProvider>
        <PageActionButton action={action({ icon: "no-such-icon-name" })} />
      </I18nProvider>,
    );

    // getIcon answers an unknown name with a generic inbox glyph. Drawing the
    // wrong picture confidently is worse than drawing none, so the lookup is
    // gated on the name being registered.
    expect(container.querySelectorAll("svg").length).toBe(0);
  });

  it("renders label-only when the action declares no icon", async () => {
    const { PageActionButton } = await import("@/base/shell/partials/PageActionButton");
    const { I18nProvider } = await import("@/i18n/I18nProvider");

    const { container } = render(
      <I18nProvider>
        <PageActionButton action={action()} />
      </I18nProvider>,
    );

    expect(container.querySelectorAll("svg").length).toBe(0);
  });
});

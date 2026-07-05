/**
 * BasicShell logout wiring — the header user menu POSTs to the logout
 * endpoint. Canonical source is `auth.logoutUrl`; a top-level `logoutUrl` shared
 * prop is only a fallback, so when both are present `auth.logoutUrl` wins.
 */

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import "../setup";

import { BasicShell } from "@/base/shell/BasicShell";
import { I18nProvider } from "@/i18n/I18nProvider";

import { mockRouter, mockUsePage } from "../setup";

function renderShell(authExtra: Record<string, unknown>, topLevel?: Record<string, unknown>) {
  mockUsePage.mockReturnValue({
    props: {
      auth: {
        id: 1,
        name: "Ada Lovelace",
        email: "ada@middag.io",
        capabilities: [],
        ...authExtra,
      },
      theme: { appearance: "light", strings: {} },
      flash: {},
      locale: "en",
      version: "0.0.0-test",
      scope: {},
      navigation: { tree: [], activeKey: "", footer: [] },
      csrf_token: "tok-123",
      ...topLevel,
    },
    url: "/dashboard",
  });

  return render(
    <I18nProvider>
      <BasicShell>
        <div>content</div>
      </BasicShell>
    </I18nProvider>,
  );
}

function openUserMenu() {
  // Radix DropdownMenu.Trigger toggles on pointerdown for mouse input.
  const trigger = screen.getByRole("button", { name: "Ada Lovelace" });
  fireEvent.pointerDown(trigger, { button: 0, ctrlKey: false });
  fireEvent.click(trigger);
}

describe("BasicShell logout", () => {
  afterEach(() => {
    cleanup();
    mockRouter.post.mockClear();
  });

  it("POSTs to auth.logoutUrl when signing out", () => {
    renderShell({ logoutUrl: "/auth/logout" });
    openUserMenu();

    fireEvent.click(screen.getByRole("menuitem", { name: "Sign out" }));

    expect(mockRouter.post).toHaveBeenCalledWith("/auth/logout", { _token: "tok-123" });
  });

  it("prefers auth.logoutUrl over a top-level logoutUrl fallback", () => {
    renderShell({ logoutUrl: "/auth/logout" }, { logoutUrl: "/legacy/logout" });
    openUserMenu();

    fireEvent.click(screen.getByRole("menuitem", { name: "Sign out" }));

    expect(mockRouter.post).toHaveBeenCalledWith("/auth/logout", { _token: "tok-123" });
  });

  it("falls back to a top-level logoutUrl when auth has none", () => {
    renderShell({}, { logoutUrl: "/legacy/logout" });
    openUserMenu();

    fireEvent.click(screen.getByRole("menuitem", { name: "Sign out" }));

    expect(mockRouter.post).toHaveBeenCalledWith("/legacy/logout", { _token: "tok-123" });
  });

  it("hides the sign-out item entirely when no logout URL is provided", () => {
    renderShell({});
    openUserMenu();

    expect(screen.queryByRole("menuitem", { name: "Sign out" })).toBeNull();
  });
});

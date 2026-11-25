/**
 * SidebarProvider persists its open state in the `middag_sidebar_state`
 * cookie. Without an explicit defaultOpen the next mount restores it; an
 * explicit defaultOpen always wins. The first render ignores the cookie so
 * server and client markup match.
 */

import { renderToString } from "react-dom/server";
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import "../setup";

import { SidebarProvider, useSidebar } from "@/primitives/reui/sidebar";

const COOKIE = "middag_sidebar_state";

function setCookie(name: string, value: string): void {
  document.cookie = `${name}=${value}; path=/`;
}

function clearCookies(): void {
  for (const name of [COOKIE, "sidebar_state"]) {
    document.cookie = `${name}=; path=/; max-age=0`;
  }
}

function Probe(): React.ReactElement {
  const { state, setOpen } = useSidebar();
  return (
    <button type="button" data-testid="probe" onClick={() => setOpen(state !== "expanded")}>
      {state}
    </button>
  );
}

const probeState = () => screen.getByTestId("probe").textContent;

describe("SidebarProvider cookie", () => {
  beforeEach(clearCookies);
  afterEach(() => {
    cleanup();
    clearCookies();
  });

  it("starts open when there is neither a cookie nor a defaultOpen", () => {
    render(
      <SidebarProvider>
        <Probe />
      </SidebarProvider>,
    );

    expect(probeState()).toBe("expanded");
  });

  it("restores the state saved by a previous toggle when defaultOpen is not set", () => {
    // Arrange: collapse once, which writes the cookie
    render(
      <SidebarProvider>
        <Probe />
      </SidebarProvider>,
    );
    act(() => screen.getByTestId("probe").click());
    expect(document.cookie).toContain(`${COOKIE}=false`);
    cleanup();

    // Act
    render(
      <SidebarProvider>
        <Probe />
      </SidebarProvider>,
    );

    // Assert
    expect(probeState()).toBe("collapsed");
  });

  it("lets an explicit defaultOpen win over the cookie", () => {
    setCookie(COOKIE, "false");

    render(
      <SidebarProvider defaultOpen>
        <Probe />
      </SidebarProvider>,
    );

    expect(probeState()).toBe("expanded");
  });

  it("ignores the old unprefixed sidebar_state cookie", () => {
    setCookie("sidebar_state", "false");

    render(
      <SidebarProvider>
        <Probe />
      </SidebarProvider>,
    );

    expect(probeState()).toBe("expanded");
  });

  it("renders the server-safe default on the server, whatever the cookie says", () => {
    setCookie(COOKIE, "false");

    const html = renderToString(
      <SidebarProvider>
        <Probe />
      </SidebarProvider>,
    );

    expect(html).toContain(">expanded<");
  });
});

/**
 * SidebarProvider persists its open state in the `sidebar_state` cookie and
 * restores it on the next mount; without the cookie, defaultOpen applies.
 */

import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import "../setup";

import { SidebarProvider, useSidebar } from "@/primitives/reui/sidebar";

const COOKIE = "sidebar_state";

function clearCookie(): void {
  document.cookie = `${COOKIE}=; path=/; max-age=0`;
}

function Probe(): React.ReactElement {
  const { state, setOpen } = useSidebar();
  return (
    <button type="button" data-testid="probe" onClick={() => setOpen(state !== "expanded")}>
      {state}
    </button>
  );
}

describe("SidebarProvider cookie", () => {
  beforeEach(clearCookie);
  afterEach(() => {
    cleanup();
    clearCookie();
  });

  it("starts from defaultOpen when there is no cookie", () => {
    render(
      <SidebarProvider defaultOpen={false}>
        <Probe />
      </SidebarProvider>,
    );

    expect(screen.getByTestId("probe").textContent).toBe("collapsed");
  });

  it("restores the state saved by a previous toggle", () => {
    // Arrange: collapse once, which writes the cookie
    render(
      <SidebarProvider>
        <Probe />
      </SidebarProvider>,
    );
    act(() => screen.getByTestId("probe").click());
    expect(document.cookie).toContain(`${COOKIE}=false`);
    cleanup();

    // Act: mount again with the default (open)
    render(
      <SidebarProvider>
        <Probe />
      </SidebarProvider>,
    );

    // Assert
    expect(screen.getByTestId("probe").textContent).toBe("collapsed");
  });
});

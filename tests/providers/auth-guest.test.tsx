/**
 * AuthProvider guest tolerance — the provider must not crash when the
 * `auth` shared prop is null or absent (guest-facing pages like login). In that
 * state: user is null, isAuthenticated is false, every capability check returns
 * false, <Can> renders nothing and <Cannot> renders its children.
 */

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AuthProvider, Can, Cannot, useAuth } from "@/app/providers/auth";

// Mutable so each test can drive a different `props` shape through usePage().
let mockProps: Record<string, unknown> = {};

vi.mock("@inertiajs/react", () => ({
  usePage: () => ({ props: mockProps, url: "/login" }),
  router: { on: () => () => {} },
}));

function GuestConsumer() {
  const { user, isAuthenticated, can } = useAuth();
  return (
    <div>
      <span data-testid="user">{user ? user.name : "guest"}</span>
      <span data-testid="authed">{String(isAuthenticated)}</span>
      <span data-testid="can-manage">{String(can("local/middag:manage"))}</span>
      <Can capability="local/middag:manage">
        <span data-testid="can-gate">visible</span>
      </Can>
      <Cannot capability="local/middag:manage">
        <span data-testid="cannot-gate">guest-visible</span>
      </Cannot>
    </div>
  );
}

function renderGuest() {
  return render(
    <AuthProvider>
      <GuestConsumer />
    </AuthProvider>,
  );
}

describe("AuthProvider guest tolerance", () => {
  afterEach(cleanup);

  it("does not crash and denies everything when auth is null", () => {
    mockProps = { auth: null, theme: {}, locale: "en", version: "0.0.0" };

    expect(() => renderGuest()).not.toThrow();

    expect(screen.getByTestId("user").textContent).toBe("guest");
    expect(screen.getByTestId("authed").textContent).toBe("false");
    expect(screen.getByTestId("can-manage").textContent).toBe("false");
    // Gate that requires the capability is hidden; the negative gate shows.
    expect(screen.queryByTestId("can-gate")).toBeNull();
    expect(screen.getByTestId("cannot-gate")).toBeDefined();
  });

  it("does not crash when auth is entirely absent", () => {
    mockProps = { theme: {}, locale: "en", version: "0.0.0" };

    expect(() => renderGuest()).not.toThrow();

    expect(screen.getByTestId("user").textContent).toBe("guest");
    expect(screen.getByTestId("authed").textContent).toBe("false");
    expect(screen.getByTestId("can-manage").textContent).toBe("false");
    expect(screen.queryByTestId("can-gate")).toBeNull();
    expect(screen.getByTestId("cannot-gate")).toBeDefined();
  });

  it("populates user and grants held capabilities when auth is present", () => {
    mockProps = {
      auth: {
        id: 7,
        name: "Ada",
        email: "ada@middag.io",
        capabilities: ["local/middag:manage"],
      },
      theme: {},
      locale: "en",
      version: "0.0.0",
    };

    renderGuest();

    expect(screen.getByTestId("user").textContent).toBe("Ada");
    expect(screen.getByTestId("authed").textContent).toBe("true");
    expect(screen.getByTestId("can-manage").textContent).toBe("true");
    expect(screen.getByTestId("can-gate")).toBeDefined();
    expect(screen.queryByTestId("cannot-gate")).toBeNull();
  });
});

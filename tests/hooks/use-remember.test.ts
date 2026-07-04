import { useState } from "react";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useRemember } from "@/base/hooks/useRemember";

// Mock Inertia's useRemember with a useState-backed stand-in that records how
// it was called, so we can assert the wrapper routes to it when enabled and
// forwards the resolved initial value + scoping key.
const inertiaCalls: Array<{ initial: unknown; key: string | undefined }> = [];

vi.mock("@inertiajs/react", () => ({
  useRemember: <S>(initial: S, key?: string) => {
    inertiaCalls.push({ initial, key });
    return useState<S>(initial);
  },
}));

beforeEach(() => {
  inertiaCalls.length = 0;
});

describe("useRemember", () => {
  it("behaves as plain useState when disabled (value tracks the plain backing)", () => {
    const { result } = renderHook(() => useRemember(0, "k:count", false));

    expect(result.current[0]).toBe(0);
    act(() => result.current[1](5));
    expect(result.current[0]).toBe(5);
  });

  it("routes to Inertia useRemember when enabled, forwarding initial + key", () => {
    const { result } = renderHook(() => useRemember("comfortable", "tbl:density", true));

    expect(inertiaCalls).toContainEqual({ initial: "comfortable", key: "tbl:density" });
    expect(result.current[0]).toBe("comfortable");
    act(() => result.current[1]("compact"));
    expect(result.current[0]).toBe("compact");
  });

  it("resolves a lazy initializer exactly once", () => {
    const factory = vi.fn(() => ({ a: false }));
    const { rerender } = renderHook(({ on }) => useRemember(factory, "k:vis", on), {
      initialProps: { on: true },
    });

    rerender({ on: true });
    rerender({ on: true });

    expect(factory).toHaveBeenCalledTimes(1);
    // The value forwarded to Inertia is the resolved object, not the function.
    expect(inertiaCalls[0]?.initial).toEqual({ a: false });
  });

  it("supports functional state updates", () => {
    const { result } = renderHook(() => useRemember(1, "k:n", false));

    act(() => result.current[1]((prev) => prev + 1));
    expect(result.current[0]).toBe(2);
  });
});

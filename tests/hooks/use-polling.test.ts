import { router } from "@inertiajs/core";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { usePolling } from "@/base/hooks/usePolling";
import type { PollConfig } from "@/contracts/generated";

function mockPoll() {
  const handle = { stop: vi.fn(), start: vi.fn(), destroy: vi.fn() };
  const spy = vi.spyOn(router, "poll").mockReturnValue(handle);
  return { handle, spy };
}

describe("usePolling", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("does not poll when config is absent", () => {
    const { spy } = mockPoll();
    renderHook(() => usePolling(undefined));
    expect(spy).not.toHaveBeenCalled();
  });

  it("does not poll when intervalMs is 0", () => {
    const { spy } = mockPoll();
    renderHook(() => usePolling({ endpoint: "/x", intervalMs: 0, pauseWhenHidden: true }));
    expect(spy).not.toHaveBeenCalled();
  });

  it("maps PollConfig to router.poll (pauseWhenHidden => keepAlive false)", () => {
    const { spy } = mockPoll();
    const poll: PollConfig = {
      endpoint: "/x",
      intervalMs: 5000,
      pauseWhenHidden: true,
    };
    renderHook(() => usePolling(poll));
    expect(spy).toHaveBeenCalledWith(
      5000,
      { only: ["contract"] },
      { keepAlive: false, mode: "cancel" },
    );
  });

  it("keepAlive is true when pauseWhenHidden is false", () => {
    const { spy } = mockPoll();
    renderHook(() => usePolling({ endpoint: "/x", intervalMs: 1000, pauseWhenHidden: false }));
    expect(spy).toHaveBeenCalledWith(
      1000,
      { only: ["contract"] },
      { keepAlive: true, mode: "cancel" },
    );
  });

  it("destroys the poll on unmount", () => {
    const { handle } = mockPoll();
    const { unmount } = renderHook(() =>
      usePolling({ endpoint: "/x", intervalMs: 1000, pauseWhenHidden: true }),
    );
    unmount();
    expect(handle.destroy).toHaveBeenCalledTimes(1);
  });

  it("stops the poll after stopAfterMs", () => {
    vi.useFakeTimers();
    const { handle } = mockPoll();
    renderHook(() =>
      usePolling({
        endpoint: "/x",
        intervalMs: 1000,
        pauseWhenHidden: true,
        stopAfterMs: 3000,
      }),
    );
    expect(handle.stop).not.toHaveBeenCalled();
    vi.advanceTimersByTime(3000);
    expect(handle.stop).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});

import { router } from "@inertiajs/react";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useLazyTabs } from "@/base/hooks/useLazyTabs";

// Helper: mock router.reload capturing callbacks
function mockReload(capture: { onSuccess?: () => void; onError?: () => void }) {
  vi.spyOn(router, "reload").mockImplementation((opts) => {
    capture.onSuccess = opts?.onSuccess as unknown as (() => void) | undefined;
    capture.onError = opts?.onError as unknown as (() => void) | undefined;
  });
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("useLazyTabs", () => {
  it("marks the default tab as loaded initially", () => {
    const { result } = renderHook(() => useLazyTabs("overview"));

    expect(result.current.isLoading("overview")).toBe(false);
    expect(result.current.hasError("overview")).toBe(false);
  });

  it("does not trigger reload for the default tab", () => {
    const reloadSpy = vi.spyOn(router, "reload");
    const { result } = renderHook(() => useLazyTabs("overview"));

    act(() => {
      result.current.handleTabChange("overview");
    });

    expect(reloadSpy).not.toHaveBeenCalled();
  });

  it("triggers router.reload when switching to an unloaded tab", () => {
    const reloadSpy = vi.spyOn(router, "reload").mockImplementation(() => {});
    const { result } = renderHook(() => useLazyTabs("overview"));

    act(() => {
      result.current.handleTabChange("invoices");
    });

    expect(reloadSpy).toHaveBeenCalledOnce();
    expect(reloadSpy).toHaveBeenCalledWith(expect.objectContaining({ only: ["invoices"] }));
  });

  it("sets isLoading to true while a tab is being fetched", () => {
    vi.spyOn(router, "reload").mockImplementation(() => {});
    const { result } = renderHook(() => useLazyTabs("overview"));

    act(() => {
      result.current.handleTabChange("invoices");
    });

    expect(result.current.isLoading("invoices")).toBe(true);
  });

  it("does not reload an already-loaded tab", () => {
    const cbs: { onSuccess?: () => void } = {};
    mockReload(cbs);

    const { result } = renderHook(() => useLazyTabs("overview"));

    act(() => {
      result.current.handleTabChange("invoices");
    });

    act(() => {
      cbs.onSuccess?.();
    });

    vi.clearAllMocks();
    const reloadSpy = vi.spyOn(router, "reload");

    act(() => {
      result.current.handleTabChange("invoices");
    });

    expect(reloadSpy).not.toHaveBeenCalled();
  });

  it("clears isLoading after successful load", () => {
    const cbs: { onSuccess?: () => void } = {};
    mockReload(cbs);

    const { result } = renderHook(() => useLazyTabs("overview"));

    act(() => {
      result.current.handleTabChange("invoices");
    });

    expect(result.current.isLoading("invoices")).toBe(true);

    act(() => {
      cbs.onSuccess?.();
    });

    expect(result.current.isLoading("invoices")).toBe(false);
  });

  it("sets hasError on failed load", () => {
    const cbs: { onError?: () => void } = {};
    mockReload(cbs);

    const { result } = renderHook(() => useLazyTabs("overview"));

    act(() => {
      result.current.handleTabChange("invoices");
    });

    act(() => {
      cbs.onError?.();
    });

    expect(result.current.hasError("invoices")).toBe(true);
    expect(result.current.isLoading("invoices")).toBe(false);
  });

  it("hasError returns false initially for all tabs", () => {
    const { result } = renderHook(() => useLazyTabs("overview"));

    expect(result.current.hasError("overview")).toBe(false);
    expect(result.current.hasError("invoices")).toBe(false);
    expect(result.current.hasError("anything")).toBe(false);
  });

  it("retryTab reloads a previously failed tab", () => {
    const cbs: { onError?: () => void } = {};
    mockReload(cbs);
    const reloadSpy = vi.mocked(router.reload);

    const { result } = renderHook(() => useLazyTabs("overview"));

    act(() => {
      result.current.handleTabChange("invoices");
    });
    act(() => {
      cbs.onError?.();
    });

    expect(result.current.hasError("invoices")).toBe(true);

    act(() => {
      result.current.retryTab("invoices");
    });

    expect(reloadSpy).toHaveBeenCalledTimes(2);
    expect(result.current.isLoading("invoices")).toBe(true);
  });

  it("does not reload a tab that is currently loading", () => {
    const reloadSpy = vi.spyOn(router, "reload").mockImplementation(() => {});
    const { result } = renderHook(() => useLazyTabs("overview"));

    act(() => {
      result.current.handleTabChange("invoices");
    });

    expect(reloadSpy).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.handleTabChange("invoices");
    });

    expect(reloadSpy).toHaveBeenCalledTimes(1);
  });
});

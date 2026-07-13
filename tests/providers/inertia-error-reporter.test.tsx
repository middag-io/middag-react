import { router } from "@inertiajs/core";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { InertiaErrorReporter } from "@/engine/providers/inertia-error-reporter";

const { captureError, toastError } = vi.hoisted(() => ({
  captureError: vi.fn(),
  toastError: vi.fn(),
}));

vi.mock("@/engine/providers/error-reporter", () => ({
  useErrorReporter: () => ({ captureError, captureMessage: vi.fn() }),
}));
vi.mock("@/i18n/useTranslation", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
vi.mock("sonner", () => ({ toast: { error: toastError } }));

type Handler = (event: { detail: Record<string, unknown> }) => void;

function mount() {
  const handlers: Record<string, Handler> = {};
  vi.spyOn(router, "on").mockImplementation(((event: string, cb: Handler) => {
    handlers[event] = cb;
    return () => {
      delete handlers[event];
    };
  }) as unknown as typeof router.on);
  render(
    <InertiaErrorReporter>
      <div />
    </InertiaErrorReporter>,
  );
  return handlers;
}

describe("InertiaErrorReporter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("reports and toasts on httpException", () => {
    const handlers = mount();
    handlers.httpException({ detail: { response: { status: 500 } } });

    expect(captureError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ action: "httpException", status: 500 }),
    );
    expect(toastError).toHaveBeenCalledWith("middag.ui.errors.http");
  });

  it("reports and toasts on networkError", () => {
    const handlers = mount();
    const error = new Error("boom");
    handlers.networkError({ detail: { error } });

    expect(captureError).toHaveBeenCalledWith(
      error,
      expect.objectContaining({ action: "networkError" }),
    );
    expect(toastError).toHaveBeenCalledWith("middag.ui.errors.network");
  });

  it("unsubscribes both listeners on unmount", () => {
    const off = vi.fn();
    vi.spyOn(router, "on").mockReturnValue(off as unknown as VoidFunction);
    const { unmount } = render(
      <InertiaErrorReporter>
        <div />
      </InertiaErrorReporter>,
    );
    unmount();
    expect(off).toHaveBeenCalledTimes(2);
  });
});

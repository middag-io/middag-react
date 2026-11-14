/**
 * PageActionButton — a disabled navigation action must render as a locked
 * <button> with no href, so it is neither navigable nor styled as enabled.
 */

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import "../setup";

import { PageActionButton } from "@/base/shell/partials/PageActionButton";
import type { PageAction } from "@/contracts/page-contract";
import { I18nProvider } from "@/i18n/I18nProvider";

import { mockRouter } from "../setup";

function renderAction(extra: Partial<PageAction>) {
  const action = {
    id: "new-store",
    label: "New Store",
    intent: "primary",
    href: "/stores/create",
    ...extra,
  } as PageAction;
  return render(
    <I18nProvider>
      <PageActionButton action={action} />
    </I18nProvider>,
  );
}

describe("PageActionButton navigation", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders an anchor with href when enabled", () => {
    renderAction({});
    const el = screen.getByTestId("action-new-store");
    expect(el.tagName).toBe("A");
    expect(el.getAttribute("href")).toBe("/stores/create");
  });

  it("renders a locked button without href when disabled", () => {
    renderAction({ disabled: true });
    const el = screen.getByTestId("action-new-store");
    expect(el.tagName).toBe("BUTTON");
    expect(el.hasAttribute("href")).toBe(false);
    expect(el.querySelector("a")).toBeNull();
    expect(el.getAttribute("aria-disabled")).toBe("true");
    expect(el.getAttribute("data-locked")).toBe("true");
    expect((el as HTMLButtonElement).disabled).toBe(true);
    expect(el.className).toContain("disabled:opacity-50");
  });

  it("does not navigate when a disabled action is clicked", () => {
    renderAction({ disabled: true });
    fireEvent.click(screen.getByTestId("action-new-store"));
    expect(mockRouter.visit).not.toHaveBeenCalled();
  });
});

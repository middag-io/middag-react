import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import "../setup";

import { MenuBar, type MenuBarMenuSpec } from "@/base/partials/MenuBar";
import { I18nProvider } from "@/i18n/I18nProvider";

const menus: MenuBarMenuSpec[] = [
  {
    label: "File",
    entries: [
      { label: "New", shortcut: "⌘N" },
      { type: "separator" },
      { label: "Save", shortcut: "⌘S", disabled: true },
    ],
  },
  {
    label: "Edit",
    entries: [{ label: "Undo" }],
  },
];

function renderMenuBar(props: Partial<Parameters<typeof MenuBar>[0]> = {}) {
  return render(
    <I18nProvider>
      <MenuBar menus={menus} {...props} />
    </I18nProvider>,
  );
}

describe("MenuBar", () => {
  afterEach(() => cleanup());

  it("renders a trigger per menu", () => {
    renderMenuBar();
    expect(screen.getByText("File")).toBeDefined();
    expect(screen.getByText("Edit")).toBeDefined();
  });

  it("labels the bar with the default translated aria-label", () => {
    renderMenuBar();
    expect(screen.getByRole("menubar").getAttribute("aria-label")).toBe("Menu bar");
  });

  it("honours an explicit ariaLabel override", () => {
    renderMenuBar({ ariaLabel: "Document menu" });
    expect(screen.getByRole("menubar").getAttribute("aria-label")).toBe("Document menu");
  });
});

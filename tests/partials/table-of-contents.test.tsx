import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import "../setup";

import { TableOfContents } from "@/base/partials/TableOfContents";
import { I18nProvider } from "@/i18n/I18nProvider";

const items = [
  { id: "intro", label: "Introduction" },
  { id: "usage", label: "Usage", level: 3 },
];

function renderToc(props = {}) {
  return render(
    <I18nProvider>
      <TableOfContents items={items} {...props} />
    </I18nProvider>,
  );
}

describe("TableOfContents", () => {
  afterEach(() => cleanup());

  it("renders an anchor per item with href and scrollspy anchor", () => {
    renderToc();
    const intro = screen.getByRole("link", { name: "Introduction" });
    expect(intro.getAttribute("href")).toBe("#intro");
    expect(intro.getAttribute("data-scrollspy-anchor")).toBe("intro");
    expect(screen.getByRole("link", { name: "Usage" }).getAttribute("href")).toBe("#usage");
  });

  it("labels the nav with the default translated aria-label", () => {
    renderToc();
    expect(screen.getByRole("navigation").getAttribute("aria-label")).toBe("Table of contents");
  });

  it("honours an explicit ariaLabel override", () => {
    renderToc({ ariaLabel: "On this page" });
    expect(screen.getByRole("navigation").getAttribute("aria-label")).toBe("On this page");
  });
});

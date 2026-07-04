import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import "../setup";

import { TreeView, type TreeViewNode } from "@/base/partials/TreeView";
import { I18nProvider } from "@/i18n/I18nProvider";

const items: Record<string, TreeViewNode> = {
  root: { label: "Root", children: ["docs", "src"] },
  docs: { label: "Docs", children: ["readme"] },
  readme: { label: "Readme" },
  src: { label: "Src", children: ["index"] },
  index: { label: "Index" },
};

function renderTree(props: Partial<Parameters<typeof TreeView>[0]> = {}) {
  return render(
    <I18nProvider>
      <TreeView items={items} rootItemId="root" expandedItems={["docs"]} {...props} />
    </I18nProvider>,
  );
}

describe("TreeView", () => {
  afterEach(() => cleanup());

  it("renders the root's children as top-level rows", () => {
    renderTree();
    expect(screen.getByText("Docs")).toBeDefined();
    expect(screen.getByText("Src")).toBeDefined();
  });

  it("shows children of an expanded folder and hides collapsed ones", () => {
    renderTree();
    expect(screen.getByText("Readme")).toBeDefined(); // docs is expanded
    expect(screen.queryByText("Index")).toBeNull(); // src is collapsed
  });

  it("labels the tree with the default translated aria-label", () => {
    renderTree();
    expect(screen.getByRole("navigation").getAttribute("aria-label")).toBe("Tree");
  });

  it("honours an explicit ariaLabel override", () => {
    renderTree({ ariaLabel: "File explorer" });
    expect(screen.getByRole("navigation").getAttribute("aria-label")).toBe("File explorer");
  });
});

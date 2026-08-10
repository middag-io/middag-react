import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import "../setup";

import { block, linkListData } from "../helpers";

describe("LinkListBlock", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders link labels with valid data", async () => {
    const { LinkListBlock } = await import("@/base/blocks/LinkListBlock");
    const descriptor = block("link_list", "test-links", linkListData());
    render(<LinkListBlock block={descriptor} />);

    expect(screen.getByText("Documentation")).toBeDefined();
    expect(screen.getByText("API Reference")).toBeDefined();
    expect(screen.getByText("External Link")).toBeDefined();
  });

  it("renders descriptions when present", async () => {
    const { LinkListBlock } = await import("@/base/blocks/LinkListBlock");
    const descriptor = block("link_list", "test-links", linkListData());
    render(<LinkListBlock block={descriptor} />);

    expect(screen.getByText("View the docs")).toBeDefined();
    expect(screen.getByText("REST API guide")).toBeDefined();
  });

  it("renders empty fragment when all items have href null", async () => {
    const { LinkListBlock } = await import("@/base/blocks/LinkListBlock");
    const data = {
      items: [
        { label: "Hidden A", href: null },
        { label: "Hidden B", href: null },
      ],
    };
    const descriptor = block("link_list", "test-links-empty", data);
    const { container } = render(<LinkListBlock block={descriptor} />);

    expect(container.innerHTML).toBe("");
  });

  it("renders duplicate labels without React key collisions", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { LinkListBlock } = await import("@/base/blocks/LinkListBlock");
    const data = {
      items: [
        { label: "Open", href: "/a" },
        { label: "Open", href: "/b" },
      ],
    };
    const descriptor = block("link_list", "test-links-dup", data);
    render(<LinkListBlock block={descriptor} />);

    // Both duplicate-labelled links render…
    expect(screen.getAllByText("Open")).toHaveLength(2);
    // …and React logged no "same key" warning (key is now href+index, not label).
    const sameKeyWarned = errorSpy.mock.calls.some((c) => String(c[0]).includes("same key"));
    expect(sameKeyWarned).toBe(false);
    errorSpy.mockRestore();
  });

  it("pins trailing text to the right and marks the active row", async () => {
    const { LinkListBlock } = await import("@/base/blocks/LinkListBlock");
    const data = {
      items: [
        { label: "All", href: "/all", trailing: "14" },
        { label: "Blocked", href: "/blocked", trailing: "6", active: true },
      ],
    };
    const { container } = render(<LinkListBlock block={block("link_list", "test-facets", data)} />);

    // The count is its own element, not part of the label — a facet list reads
    // as two columns, and folded into the label it becomes part of the name.
    expect(screen.getByText("14")).toBeDefined();

    const rows = container.querySelectorAll("a");
    expect(rows[0].getAttribute("aria-current")).toBeNull();
    expect(rows[1].getAttribute("aria-current")).toBe("true");
  });

  it("tightens the rows when meta.dense is set", async () => {
    const { LinkListBlock } = await import("@/base/blocks/LinkListBlock");
    const data = { items: [{ label: "All", href: "/all" }] };

    const loose = render(<LinkListBlock block={block("link_list", "test-loose", data)} />);
    expect(loose.container.querySelector("a")!.className).toContain("py-3");
    loose.unmount();

    const tight = render(
      <LinkListBlock block={block("link_list", "test-dense", data, { meta: { dense: true } })} />,
    );
    expect(tight.container.querySelector("a")!.className).toContain("py-1.5");
  });
});

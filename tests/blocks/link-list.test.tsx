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

  it("renders duplicate labels without React key collisions (F-33)", async () => {
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
});

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import "../setup";

import { EntityItem } from "@/base/partials/EntityItem";

describe("EntityItem", () => {
  afterEach(() => cleanup());

  it("renders title and description", () => {
    render(<EntityItem title="Ada Lovelace" description="Mathematician" />);
    expect(screen.getByText("Ada Lovelace")).toBeDefined();
    expect(screen.getByText("Mathematician")).toBeDefined();
  });

  it("renders the avatar fallback initials", () => {
    render(<EntityItem title="Ada Lovelace" avatar={{ fallback: "AL" }} />);
    expect(screen.getByText("AL")).toBeDefined();
  });

  it("makes the title a link when href is set", () => {
    render(<EntityItem title="Profile" href="/users/1" />);
    const link = screen.getByRole("link", { name: "Profile" });
    expect(link.getAttribute("href")).toBe("/users/1");
  });

  it("makes the title a button that fires onClick", () => {
    const onClick = vi.fn();
    render(<EntityItem title="Select" onClick={onClick} />);
    fireEvent.click(screen.getByRole("button", { name: "Select" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders actions and fires their onClick", () => {
    const onClick = vi.fn();
    render(<EntityItem title="Row" actions={[{ id: "edit", label: "Edit", onClick }]} />);
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders an action as a link when the action has an href", () => {
    render(<EntityItem title="Row" actions={[{ id: "open", label: "Open", href: "/open/1" }]} />);
    expect(screen.getByRole("link", { name: "Open" }).getAttribute("href")).toBe("/open/1");
  });
});

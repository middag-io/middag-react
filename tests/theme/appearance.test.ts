import { afterEach, describe, expect, it } from "vitest";

import { applyTheme } from "@/base/theme/appearance";

describe("applyTheme — color-scheme sync", () => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "";
  });

  it("sets color-scheme=dark and .dark class when applying dark", () => {
    applyTheme("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("sets color-scheme=light and removes .dark class when applying light", () => {
    applyTheme("dark");
    applyTheme("light");
    expect(document.documentElement.style.colorScheme).toBe("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("mirrors data-theme onto .middag-root elements", () => {
    const root = document.createElement("div");
    root.className = "middag-root";
    document.body.appendChild(root);
    applyTheme("dark");
    expect(root.getAttribute("data-theme")).toBe("dark");
    document.body.removeChild(root);
  });
});

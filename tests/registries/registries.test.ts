import type { ComponentType } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  blockRegistry,
  layoutRegistry,
  registerBlock,
  registerLayout,
  registerShell,
  resolveBlock,
  resolveLayout,
  resolveShell,
  shellRegistry,
} from "@/app/registries";
import type { BlockProps, LayoutProps, ShellProps } from "@/app/registries";

// ---------------------------------------------------------------------------
// Dummy components for registration
// ---------------------------------------------------------------------------

const FakeShell: ComponentType<ShellProps> = () => null;
const FakeLayout: ComponentType<LayoutProps> = () => null;
const FakeBlock: ComponentType<BlockProps> = () => null;

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("registries", () => {
  beforeEach(() => {
    shellRegistry.clear();
    layoutRegistry.clear();
    blockRegistry.clear();
  });

  // ── register* ────────────────────────────────────────────────────────────

  describe("registerShell", () => {
    it("stores a component in shellRegistry", () => {
      registerShell("product", FakeShell);
      expect(shellRegistry.get("product")).toBe(FakeShell);
    });
  });

  describe("registerLayout", () => {
    it("stores a component in layoutRegistry", () => {
      registerLayout("stack", FakeLayout);
      expect(layoutRegistry.get("stack")).toBe(FakeLayout);
    });
  });

  describe("registerBlock", () => {
    it("stores a component in blockRegistry", () => {
      registerBlock("dense_table", FakeBlock);
      expect(blockRegistry.get("dense_table")).toBe(FakeBlock);
    });
  });

  // ── register* — last-write-wins ─────────────────────────────────────────
  // Registries are plain Maps: re-registering an existing key overwrites the
  // prior component. This is the documented override contract — a consumer
  // registering a custom "basic" shell after registerDefaults() must win.

  describe("register* (re-register same key)", () => {
    const SecondShell: ComponentType<ShellProps> = () => null;
    const SecondLayout: ComponentType<LayoutProps> = () => null;
    const SecondBlock: ComponentType<BlockProps> = () => null;

    it("registerShell — second registration overrides the first", () => {
      registerShell("product", FakeShell);
      registerShell("product", SecondShell);
      expect(resolveShell("product")).toBe(SecondShell);
    });

    it("registerLayout — second registration overrides the first", () => {
      registerLayout("stack", FakeLayout);
      registerLayout("stack", SecondLayout);
      expect(resolveLayout("stack")).toBe(SecondLayout);
    });

    it("registerBlock — second registration overrides the first", () => {
      registerBlock("dense_table", FakeBlock);
      registerBlock("dense_table", SecondBlock);
      expect(resolveBlock("dense_table")).toBe(SecondBlock);
    });
  });

  // ── resolve* — success ──────────────────────────────────────────────────

  describe("resolveShell", () => {
    it("returns a registered component", () => {
      registerShell("admin", FakeShell);
      expect(resolveShell("admin")).toBe(FakeShell);
    });
  });

  describe("resolveLayout", () => {
    it("returns a registered component", () => {
      registerLayout("split", FakeLayout);
      expect(resolveLayout("split")).toBe(FakeLayout);
    });
  });

  describe("resolveBlock", () => {
    it("returns a registered component", () => {
      registerBlock("metric_card", FakeBlock);
      expect(resolveBlock("metric_card")).toBe(FakeBlock);
    });
  });

  // ── resolve* — unknown key with other registrations ─────────────────────

  describe("resolveShell (unknown key, non-empty registry)", () => {
    it("returns undefined and warns", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      registerShell("product", FakeShell);

      const result = resolveShell("admin");

      expect(result).toBeUndefined();
      expect(warnSpy).toHaveBeenCalledOnce();
      expect(warnSpy.mock.calls[0][0]).toContain('"admin" not registered');
      expect(warnSpy.mock.calls[0][0]).toContain("Available shells:");

      warnSpy.mockRestore();
    });
  });

  describe("resolveLayout (unknown key, non-empty registry)", () => {
    it("returns undefined and warns", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      registerLayout("stack", FakeLayout);

      const result = resolveLayout("unknown-layout");

      expect(result).toBeUndefined();
      expect(warnSpy).toHaveBeenCalledOnce();
      expect(warnSpy.mock.calls[0][0]).toContain('"unknown-layout" not registered');
      expect(warnSpy.mock.calls[0][0]).toContain("Available layouts:");

      warnSpy.mockRestore();
    });
  });

  describe("resolveBlock (unknown key, non-empty registry)", () => {
    it("returns undefined and warns", () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      registerBlock("dense_table", FakeBlock);

      const result = resolveBlock("nonexistent_block");

      expect(result).toBeUndefined();
      expect(warnSpy).toHaveBeenCalledOnce();
      expect(warnSpy.mock.calls[0][0]).toContain('"nonexistent_block" not registered');
      expect(warnSpy.mock.calls[0][0]).toContain("Available blocks:");

      warnSpy.mockRestore();
    });
  });

  // ── resolve* — empty registry includes registerDefaults() hint ──────────

  describe("resolveShell (empty registry)", () => {
    it('warns with "did you call registerDefaults()?"', () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      resolveShell("product");

      expect(warnSpy).toHaveBeenCalledOnce();
      expect(warnSpy.mock.calls[0][0]).toContain("did you call registerDefaults()?");

      warnSpy.mockRestore();
    });
  });

  describe("resolveLayout (empty registry)", () => {
    it('warns with "did you call registerDefaults()?"', () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      resolveLayout("stack");

      expect(warnSpy).toHaveBeenCalledOnce();
      expect(warnSpy.mock.calls[0][0]).toContain("did you call registerDefaults()?");

      warnSpy.mockRestore();
    });
  });

  describe("resolveBlock (empty registry)", () => {
    it('warns with "did you call registerDefaults()?"', () => {
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      resolveBlock("dense_table");

      expect(warnSpy).toHaveBeenCalledOnce();
      expect(warnSpy.mock.calls[0][0]).toContain("did you call registerDefaults()?");

      warnSpy.mockRestore();
    });
  });
});

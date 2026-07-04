/**
 * Shared test setup for block/integration tests.
 *
 * Provides common mocks that almost every block component needs:
 * - @inertiajs/react (usePage, Link, router)
 * - @inertiajs/core (router)
 * - matchMedia (needed by Radix UI / Sonner)
 * - IntersectionObserver (needed by some UI components)
 * - ResizeObserver (needed by Radix UI)
 *
 * Import this at the top of each test file via:
 *   import "../setup";
 *
 * For tests that need custom usePage, override mockUsePage after import.
 */

import type { ReactNode } from "react";
import { vi } from "vitest";

// ── matchMedia ──────────────────────────────────────────────────────────
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ── IntersectionObserver ────────────────────────────────────────────────
if (!globalThis.IntersectionObserver) {
  globalThis.IntersectionObserver = class IntersectionObserver {
    readonly root = null;
    readonly rootMargin = "0px";
    readonly thresholds = [0];
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn().mockReturnValue([]);
  } as unknown as typeof globalThis.IntersectionObserver;
}

// ── ResizeObserver ──────────────────────────────────────────────────────
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class ResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  } as unknown as typeof globalThis.ResizeObserver;
}

// ── Inertia mocks ───────────────────────────────────────────────────────
export const mockRouter = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
  reload: vi.fn(),
  visit: vi.fn(),
  on: vi.fn().mockReturnValue(() => {}),
};

export const mockUsePage = vi.fn().mockReturnValue({
  props: {
    auth: { id: 1, name: "Test User", email: "test@example.com", capabilities: [] },
    theme: { appearance: "light", strings: {} },
    flash: {},
    locale: "en",
    version: "0.0.0-test",
    scope: {},
  },
  url: "/test",
});

vi.mock("@inertiajs/react", () => ({
  usePage: () => mockUsePage(),
  router: mockRouter,
  Link: ({ children, href, ...props }: Record<string, unknown>) => (
    <a href={href as string} {...props}>
      {children as string}
    </a>
  ),
  // Deferred/WhenVisible: render children eagerly (treat the prop as loaded).
  // Block trees rendered in tests get resolved data via mockUsePage().
  Deferred: ({ children }: Record<string, unknown>) => children as ReactNode,
  WhenVisible: ({ children }: Record<string, unknown>) => children as ReactNode,
}));

vi.mock("@inertiajs/core", () => ({
  router: mockRouter,
}));

// ── nprogress ───────────────────────────────────────────────────────────
vi.mock("nprogress", () => ({
  default: { start: vi.fn(), done: vi.fn(), configure: vi.fn() },
}));

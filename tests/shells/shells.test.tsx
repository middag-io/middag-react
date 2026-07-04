/**
 * Shell render smoke tests — each shell renders without crashing.
 *
 * Mocks usePage() from @inertiajs/react to provide SharedProps.
 * Does NOT test full interactivity — just that the component tree mounts.
 */

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { propsWithContract } from "../test-helpers";

// jsdom does not implement matchMedia — Sonner's Toaster needs it
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

// Mock Inertia usePage — returns SharedProps with embedded contract
const mockUsePage = vi.fn();
vi.mock("@inertiajs/react", () => ({
  usePage: () => mockUsePage(),
  router: {
    on: () => () => {},
    visit: vi.fn(),
    get: vi.fn(),
    reload: vi.fn(),
  },
  Link: ({ children, ...props }: Record<string, unknown>) => (
    <a href={props.href as string}>{children as string}</a>
  ),
}));

// Mock nprogress (used by ProgressProvider)
vi.mock("nprogress", () => ({
  default: { start: vi.fn(), done: vi.fn(), configure: vi.fn() },
}));

const MINIMAL_CONTRACT = {
  version: "1",
  shell: "product",
  page: {
    key: "test",
    title: "Test Page",
    breadcrumbs: [{ label: "Home", href: "/" }],
    actions: [],
  },
  layout: {
    template: "stack",
    regions: { content: [] },
  },
};

describe("shell render smoke tests", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    mockUsePage.mockReturnValue({
      props: propsWithContract(MINIMAL_CONTRACT),
      url: "/test",
    });
  });

  it("ImmersiveShell renders with title and close button", async () => {
    const { ImmersiveShell } = await import("@/base/shell/ImmersiveShell");

    // I18nProvider needed for useTranslation
    const { I18nProvider } = await import("@/i18n/I18nProvider");

    render(
      <I18nProvider>
        <ImmersiveShell>
          <div data-testid="content">Hello</div>
        </ImmersiveShell>
      </I18nProvider>,
    );

    // Title from contract
    expect(await screen.findByText("Test Page")).toBeDefined();
    // Content rendered
    expect(screen.getByTestId("content")).toBeDefined();
    // Close button exists (aria-label from i18n: "Close" or key fallback)
    const closeBtn = document.querySelector("button[aria-label]");
    expect(closeBtn).not.toBeNull();
    // Main content area
    expect(document.getElementById("middag-main-content")).not.toBeNull();
  });

  it("ImmersiveShell has no sidebar", async () => {
    const { ImmersiveShell } = await import("@/base/shell/ImmersiveShell");
    const { I18nProvider } = await import("@/i18n/I18nProvider");

    render(
      <I18nProvider>
        <ImmersiveShell>
          <div>Content</div>
        </ImmersiveShell>
      </I18nProvider>,
    );

    // Wait for the tree to settle before asserting the absence of sidebar nodes.
    await screen.findByText("Content");
    // No sidebar elements
    expect(document.querySelector('[data-slot="sidebar"]')).toBeNull();
    expect(document.querySelector('[aria-label*="Navigation"]')).toBeNull();
  });

  // The rich ProductShell ships in @middag-io/react-pro — its render smoke
  // tests live in that package's suite, not here.
});

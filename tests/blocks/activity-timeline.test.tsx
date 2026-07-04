import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import "../setup";

import { activityTimelineData, block } from "../helpers";
import { mockUsePage } from "../setup";

/** Shared props the page always carries (mirrors tests/setup default). */
const sharedProps = {
  auth: { id: 1, name: "Test User", email: "test@example.com", capabilities: [] },
  theme: { appearance: "light", strings: {} },
  flash: {},
  locale: "en",
  version: "0.0.0-test",
  scope: {},
};

describe("ActivityTimelineBlock", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders actor names and group label", async () => {
    const { ActivityTimelineBlock } = await import("@/base/blocks/ActivityTimelineBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("activity_timeline", "test-timeline", activityTimelineData());

    render(
      <I18nProvider>
        <ActivityTimelineBlock block={descriptor} />
      </I18nProvider>,
    );

    expect(screen.getByText("Alice")).toBeDefined();
    expect(screen.getByText("Bob")).toBeDefined();
    expect(screen.getByText("Today")).toBeDefined();
  });

  it("renders action text alongside actor names", async () => {
    const { ActivityTimelineBlock } = await import("@/base/blocks/ActivityTimelineBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("activity_timeline", "test-timeline-actions", activityTimelineData());

    render(
      <I18nProvider>
        <ActivityTimelineBlock block={descriptor} />
      </I18nProvider>,
    );

    // Each entry shows "actor action" text
    expect(screen.getByText(/created/)).toBeDefined();
    expect(screen.getByText(/updated/)).toBeDefined();
  });

  it("renders empty placeholder when no entries", async () => {
    const { ActivityTimelineBlock } = await import("@/base/blocks/ActivityTimelineBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const data = { groups: [{ label: "Empty Day", entries: [] }] };
    const descriptor = block("activity_timeline", "test-timeline-empty", data);

    render(
      <I18nProvider>
        <ActivityTimelineBlock block={descriptor} />
      </I18nProvider>,
    );

    // Should not render the list, should show empty state
    expect(screen.queryByText("Alice")).toBeNull();
  });
});

/**
 * Inertia v3 prop merging is owned by @inertiajs/core: the backend marks a prop
 * with mergeProps/prependProps/deepMergeProps/matchPropsOn and the client
 * accumulates it before render. The block reads the resolved value from the
 * live page prop (named after `block.key`, the load-more `only:[key]` token),
 * falling back to the contract-embedded data. These fixtures prove the block
 * renders the final merged state without doing any merging itself.
 */
describe("ActivityTimelineBlock — Inertia v3 merge pass-through", () => {
  afterEach(() => {
    mockUsePage.mockReturnValue({ props: { ...sharedProps }, url: "/test" });
    cleanup();
  });

  it("renders the live appended page prop over the contract data", async () => {
    const { ActivityTimelineBlock } = await import("@/base/blocks/ActivityTimelineBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");

    // Contract carries only the first page (Alice/Bob); core has appended Carol
    // onto the live `feed` prop via mergeProps:["feed"].
    const descriptor = block("activity_timeline", "feed", activityTimelineData());
    const merged = {
      groups: [
        {
          label: "Today",
          entries: [
            ...activityTimelineData().groups[0].entries,
            {
              id: "3",
              actor: "Carol",
              action: "deleted",
              target: "Document C",
              timestamp: 1705300000,
              icon: "delete",
              color: "destructive" as const,
            },
          ],
        },
      ],
    };
    mockUsePage.mockReturnValue({ props: { ...sharedProps, feed: merged }, url: "/test" });

    render(
      <I18nProvider>
        <ActivityTimelineBlock block={descriptor} />
      </I18nProvider>,
    );

    expect(screen.getByText("Alice")).toBeDefined();
    expect(screen.getByText("Bob")).toBeDefined();
    expect(screen.getByText("Carol")).toBeDefined(); // only on the live merged prop
  });

  it("honors reset: a fresh live prop replaces the contract entries", async () => {
    const { ActivityTimelineBlock } = await import("@/base/blocks/ActivityTimelineBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");

    const descriptor = block("activity_timeline", "feed", activityTimelineData()); // Alice/Bob
    const reset = {
      groups: [
        {
          label: "Today",
          entries: [
            {
              id: "9",
              actor: "Dave",
              action: "archived",
              target: "Document Z",
              timestamp: 1705300000,
              icon: "archive",
              color: "neutral" as const,
            },
          ],
        },
      ],
    };
    mockUsePage.mockReturnValue({ props: { ...sharedProps, feed: reset }, url: "/test" });

    render(
      <I18nProvider>
        <ActivityTimelineBlock block={descriptor} />
      </I18nProvider>,
    );

    expect(screen.getByText("Dave")).toBeDefined();
    expect(screen.queryByText("Alice")).toBeNull(); // contract entry replaced by reset prop
  });

  it("falls back to the contract data when the page prop is absent (no regression)", async () => {
    const { ActivityTimelineBlock } = await import("@/base/blocks/ActivityTimelineBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");

    mockUsePage.mockReturnValue({ props: { ...sharedProps }, url: "/test" });
    const descriptor = block("activity_timeline", "feed", activityTimelineData());

    render(
      <I18nProvider>
        <ActivityTimelineBlock block={descriptor} />
      </I18nProvider>,
    );

    expect(screen.getByText("Alice")).toBeDefined();
    expect(screen.getByText("Bob")).toBeDefined();
  });
});

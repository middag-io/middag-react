import "../setup";

import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { EntityPickerField } from "@/base/form/fields/EntityPickerField";
import { setHostPendingTracker } from "@/lib/host-pending";

/**
 * The async picker waits 300ms before it searches. A host that waits on pending
 * work must see the field busy for that whole window, not only while the
 * request is out — otherwise it reads the list before the results arrive.
 */
function listTracker() {
  const open: string[] = [];
  const tracker = vi.fn((key: string) => {
    open.push(key);
    return () => {
      open.splice(open.indexOf(key), 1);
    };
  });
  return { open, tracker };
}

const OPTION = { value: "7", label: "Maria Silva" };

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  setHostPendingTracker(null);
});

describe("EntityPickerField pending work", () => {
  it("is pending from the scheduled search until the results land", async () => {
    const { open, tracker } = listTracker();
    setHostPendingTracker(tracker);
    let respond!: (response: Response) => void;
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise<Response>((r) => (respond = r))),
    );

    // The preselected label seeds the search text, so the search is scheduled on mount.
    render(
      <EntityPickerField
        id="owner"
        value="7"
        onChange={() => {}}
        initialOption={OPTION}
        autocompleteHref="/api/users"
      />,
    );

    expect(open.length).toBeGreaterThan(0);
    expect(fetch).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(300);
    });
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(open.length).toBeGreaterThan(0);

    await act(async () => {
      respond(new Response(JSON.stringify([{ id: 7, name: "Maria Silva" }])));
    });
    expect(open).toEqual([]);
  });

  it("closes the entry when the field unmounts before the search runs", () => {
    const { open, tracker } = listTracker();
    setHostPendingTracker(tracker);
    vi.stubGlobal("fetch", vi.fn());

    const { unmount } = render(
      <EntityPickerField
        id="owner"
        value="7"
        onChange={() => {}}
        initialOption={OPTION}
        autocompleteHref="/api/users"
      />,
    );
    expect(open.length).toBeGreaterThan(0);

    unmount();
    vi.runAllTimers();

    expect(open).toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  beginPending,
  getHostPendingTracker,
  PENDING_FETCH_KEY,
  setHostPendingTracker,
  trackedFetch,
} from "@/lib/host-pending";

/** A tracker that keeps its open entries the way Moodle's pending list does. */
function listTracker() {
  const open: string[] = [];
  const tracker = vi.fn((key: string) => {
    open.push(key);
    return vi.fn(() => {
      open.splice(open.indexOf(key), 1);
    });
  });
  return { open, tracker };
}

afterEach(() => {
  setHostPendingTracker(null);
  vi.unstubAllGlobals();
});

describe("host-pending", () => {
  it("is null until set, and can be cleared", () => {
    expect(getHostPendingTracker()).toBeNull();

    const { tracker } = listTracker();
    setHostPendingTracker(tracker);
    expect(getHostPendingTracker()).toBe(tracker);

    setHostPendingTracker(null);
    expect(getHostPendingTracker()).toBeNull();
  });

  it("beginPending is a no-op without a tracker", () => {
    expect(() => beginPending()()).not.toThrow();
  });

  it("beginPending reaches the host once, however often it is released", () => {
    const { open, tracker } = listTracker();
    setHostPendingTracker(tracker);

    const release = beginPending("custom/key");
    expect(open).toEqual(["custom/key"]);

    release();
    release();
    expect(open).toEqual([]);
    expect(tracker.mock.results[0].value).toHaveBeenCalledTimes(1);
  });

  it("a throwing tracker never breaks the caller", () => {
    setHostPendingTracker(() => {
      throw new Error("host broke");
    });

    expect(() => beginPending()()).not.toThrow();
  });

  it("a throwing release never breaks the caller", () => {
    setHostPendingTracker(() => () => {
      throw new Error("host broke");
    });

    expect(() => beginPending()()).not.toThrow();
  });

  it("trackedFetch keeps one entry open until the response arrives", async () => {
    const { open, tracker } = listTracker();
    setHostPendingTracker(tracker);
    let respond!: (response: Response) => void;
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise<Response>((r) => (respond = r))),
    );

    const request = trackedFetch("/items", { headers: { Accept: "application/json" } });
    expect(open).toEqual([PENDING_FETCH_KEY]);

    respond(new Response("[]"));
    await request;
    expect(open).toEqual([]);
    expect(fetch).toHaveBeenCalledWith("/items", { headers: { Accept: "application/json" } });
  });

  it("trackedFetch closes the entry when the request fails", async () => {
    const { open, tracker } = listTracker();
    setHostPendingTracker(tracker);
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));

    await expect(trackedFetch("/items")).rejects.toThrow("Failed to fetch");
    expect(open).toEqual([]);
  });
});

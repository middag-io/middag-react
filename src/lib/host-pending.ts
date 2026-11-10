/**
 * Host pending-work tracker.
 *
 * Some hosts keep a list of JavaScript work still in flight and let tooling wait
 * for it: Moodle's `M.util.js_pending` / `js_complete` is what its Behat
 * acceptance tests wait on after every step. The engine does not know any host,
 * so the host injects a tracker and the engine only calls it around the raw
 * `fetch` side-calls that bypass the Inertia router (router visits are the
 * host's to track through the router's own events).
 *
 * No tracker registered (WordPress, the demo, tests) makes every call a no-op.
 */

/**
 * Opens one pending entry under `key` and returns the function that closes it.
 * The engine calls the returned function exactly once.
 */
export type HostPendingTracker = (key: string) => () => void;

/** Key the engine's own requests are reported under. */
export const PENDING_FETCH_KEY = "middag-react/fetch";

let tracker: HostPendingTracker | null = null;

export function setHostPendingTracker(fn: HostPendingTracker | null): void {
  tracker = fn;
}

export function getHostPendingTracker(): HostPendingTracker | null {
  return tracker;
}

/**
 * Opens one pending entry and returns its release.
 *
 * The release is safe to call more than once — only the first call reaches the
 * host — so a caller can release from both a `finally` and an effect cleanup.
 * A tracker that throws never breaks the caller: the work goes on untracked.
 */
export function beginPending(key: string = PENDING_FETCH_KEY): () => void {
  let release: (() => void) | undefined;

  try {
    release = tracker?.(key);
  } catch {
    release = undefined;
  }

  let done = false;

  return () => {
    if (done) return;
    done = true;

    try {
      release?.();
    } catch {
      // A broken host tracker must not surface as a failed request.
    }
  };
}

/** `fetch` with one pending entry open until the request settles, success or failure. */
export async function trackedFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const release = beginPending();

  try {
    // eslint-disable-next-line no-restricted-globals -- the one sanctioned raw fetch
    return await fetch(input, init);
  } finally {
    release();
  }
}

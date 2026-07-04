/**
 * usePolling — Inertia v3 contract-driven polling for blocks.
 *
 * Consumes the canonical `PollConfig` (`BlockDescriptor.poll`, generated from
 * `Middag\Ui`): the server owns whether and how a block polls.
 *
 *   - intervalMs       → poll interval in ms (0 / absent ⇒ no polling)
 *   - pauseWhenHidden  → throttle while the tab is hidden (maps to keepAlive: false)
 *   - stopAfterMs      → stop polling after this elapsed time (optional)
 *   - endpoint         → server-side hint; the same-page reload refreshes the contract
 *
 * Uses Inertia v3 `router.poll` (mode "cancel" for overlap-guard, visibility-aware
 * via keepAlive) instead of a hand-rolled setInterval: automatic cleanup,
 * pause-on-hidden, and overlap protection come for free. The effect re-arms when
 * the poll config changes, so the server can start/stop/retune polling by sending
 * a new contract.
 */

import { useEffect } from "react";
import { router } from "@inertiajs/core";

import type { PollConfig } from "@/contracts/generated";

export function usePolling(poll: PollConfig | undefined): void {
  const intervalMs = poll?.intervalMs ?? 0;
  const enabled = intervalMs > 0;
  // pauseWhenHidden=true ⇒ throttle while hidden ⇒ keepAlive must be false.
  const keepAlive = poll?.pauseWhenHidden === false;
  const stopAfterMs = poll?.stopAfterMs ?? 0;

  useEffect(() => {
    if (!enabled) return;

    const handle = router.poll(intervalMs, { only: ["contract"] }, { keepAlive, mode: "cancel" });

    const stopTimer = stopAfterMs > 0 ? setTimeout(() => handle.stop(), stopAfterMs) : null;

    return () => {
      if (stopTimer !== null) clearTimeout(stopTimer);
      handle.destroy();
    };
  }, [enabled, intervalMs, keepAlive, stopAfterMs]);
}

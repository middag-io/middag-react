/**
 * HostSlot — portal React components into host-rendered DOM slots.
 *
 * Pattern: the host (Moodle PHP / WordPress) renders empty containers
 * with a known `id` or `data-middag-slot` attribute inside its own
 * chrome (e.g. the Boost navbar). React portals MIDDAG widgets into
 * those containers at runtime, achieving seamless visual integration
 * without the host needing to know about React.
 *
 * ## Host side (PHP — Moodle Boost renderer example)
 *
 * ```php
 * // In theme_boost/layout/columns2.php or local_middag output hook:
 * echo '<div id="middag-global-search" data-middag-slot="search" class="middag-slot"></div>';
 * echo '<div id="middag-org-selector" data-middag-slot="org" class="middag-slot"></div>';
 * echo '<div id="middag-quick-menu" data-middag-slot="menu" class="middag-slot"></div>';
 * ```
 *
 * ## React side (app bootstrap)
 *
 * ```tsx
 * import { HostSlot } from '@middag-io/react';
 * import { BoostSearchBar } from '@middag-io/react';
 *
 * // Inside your provider tree (after I18nProvider):
 * <HostSlot selector="#middag-global-search">
 *   <BoostSearchBar onActivate={() => openCommandPalette()} />
 * </HostSlot>
 *
 * <HostSlot selector="#middag-org-selector">
 *   <OrgSelector orgs={scopeData.orgs} current={scopeData.current} />
 * </HostSlot>
 * ```
 *
 * ## How it works
 *
 * 1. On mount, `HostSlot` queries the DOM for the target element.
 * 2. If found, it uses `createPortal` to render children into it.
 * 3. If not found (e.g. mock environment, WP without slots), renders nothing.
 * 4. A MutationObserver watches for late-arriving slots (Moodle may render
 *    the navbar asynchronously via Mustache templates).
 *
 * ## Reserved slot IDs
 *
 * | Slot ID                  | Purpose                      | Injected by     |
 * |--------------------------|------------------------------|-----------------|
 * | `middag-global-search`   | Central search bar (⌘K)      | local_middag    |
 * | `middag-org-selector`    | Organization/scope switcher  | local_middag    |
 * | `middag-quick-menu`      | MIDDAG quick-access grid     | local_middag    |
 *
 * @see ADR-807 ref/host-integration
 */

"use client";

import { useMemo, useSyncExternalStore, type ReactElement, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface HostSlotProps {
  /** CSS selector for the host-rendered container (e.g. "#middag-global-search"). */
  selector: string;
  /** Content to portal into the slot. */
  children: ReactNode;
  /** If true, render children inline as fallback when the slot is not found. */
  fallback?: boolean;
}

/**
 * External store that watches for a DOM element matching a selector.
 * Uses MutationObserver to detect late-arriving elements.
 */
function createSlotStore(selector: string) {
  let current: Element | null = document.querySelector(selector);
  const listeners = new Set<() => void>();

  const subscribe = (cb: () => void) => {
    listeners.add(cb);

    // If element already found, no observer needed
    if (current) return () => listeners.delete(cb);

    // Watch for late-arriving slots
    const observer = new MutationObserver(() => {
      const found = document.querySelector(selector);
      if (found && found !== current) {
        current = found;
        listeners.forEach((fn) => fn());
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      listeners.delete(cb);
      observer.disconnect();
    };
  };

  const getSnapshot = () => current;

  return { subscribe, getSnapshot };
}

/**
 * Portal children into a host-rendered DOM element identified by CSS selector.
 * If the element doesn't exist, renders nothing (or children inline if fallback=true).
 */
export function HostSlot({
  selector,
  children,
  fallback = false,
}: HostSlotProps): ReactElement | null {
  const store = useMemo(() => createSlotStore(selector), [selector]);

  const target = useSyncExternalStore(store.subscribe, store.getSnapshot);

  if (target) {
    return createPortal(children, target);
  }

  if (fallback) {
    return <>{children}</>;
  }

  return null;
}

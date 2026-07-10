/**
 * useLazyTabs — lazy-loads Inertia partial data when a tab is activated.
 *
 * Tracks which tabs have been loaded, which are in-flight, and which
 * failed. Consumers call `handleTabChange` on every tab switch;
 * the hook triggers `router.reload({ only: [tab] })` for tabs that
 * haven't been fetched yet.
 *
 * @example
 * ```tsx
 * const { handleTabChange, isLoading, hasError, retryTab } = useLazyTabs("overview");
 *
 * <SomeTabsComponent onTabChange={handleTabChange}>
 *   <Tab key="overview">...</Tab>
 *   <Tab key="invoices">
 *     {isLoading("invoices") ? <Spinner /> : <InvoiceTable />}
 *     {hasError("invoices") && <RetryButton onClick={() => retryTab("invoices")} />}
 *   </Tab>
 * </SomeTabsComponent>
 * ```
 *
 * Imperative escape hatch: for simple per-tab loading without retry/error
 * tracking, prefer the declarative `<WhenVisible data={tab}>` (loads when the
 * tab panel scrolls into view) or `<Deferred data={tab}>` from
 * `@inertiajs/react`. This hook stays for cases that need explicit
 * loading/error state and a `retryTab` affordance the primitives don't expose.
 */

import { useCallback, useState } from "react";
import { router } from "@inertiajs/react";

export interface UseLazyTabsReturn {
  /** Call on every tab switch — triggers partial reload for unloaded tabs. */
  handleTabChange: (tab: string) => void;
  /** True while a tab's data is being fetched. */
  isLoading: (tab: string) => boolean;
  /** True if a tab's fetch failed. */
  hasError: (tab: string) => boolean;
  /** Re-fetch a previously failed tab. */
  retryTab: (tab: string) => void;
}

export function useLazyTabs(defaultTab: string): UseLazyTabsReturn {
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set([defaultTab]));
  const [loadingTabs, setLoadingTabs] = useState<Set<string>>(new Set());
  const [errorTabs, setErrorTabs] = useState<Set<string>>(new Set());

  const triggerLoad = useCallback((tab: string) => {
    setLoadingTabs((prev) => new Set([...prev, tab]));
    setErrorTabs((prev) => {
      const next = new Set(prev);
      next.delete(tab);
      return next;
    });

    router.reload({
      only: [tab],
      onSuccess: () => {
        setLoadedTabs((prev) => new Set([...prev, tab]));
        setLoadingTabs((prev) => {
          const next = new Set(prev);
          next.delete(tab);
          return next;
        });
      },
      onError: () => {
        setErrorTabs((prev) => new Set([...prev, tab]));
        setLoadingTabs((prev) => {
          const next = new Set(prev);
          next.delete(tab);
          return next;
        });
      },
    });
  }, []);

  const handleTabChange = useCallback(
    (tab: string) => {
      if (tab !== defaultTab && !loadedTabs.has(tab) && !loadingTabs.has(tab)) {
        triggerLoad(tab);
      }
    },
    [defaultTab, loadedTabs, loadingTabs, triggerLoad],
  );

  const isLoading = useCallback((tab: string) => loadingTabs.has(tab), [loadingTabs]);

  const hasError = useCallback((tab: string) => errorTabs.has(tab), [errorTabs]);

  const retryTab = useCallback(
    (tab: string) => {
      triggerLoad(tab);
    },
    [triggerLoad],
  );

  return { handleTabChange, isLoading, hasError, retryTab };
}

/**
 * useIsDark — reactive dark mode detection via MutationObserver.
 *
 * Watches `document.documentElement` for class changes and returns
 * whether the `dark` class is currently present. Shared source of
 * truth for all components that need to react to theme changes
 * (mock headers, shells, etc.).
 *
 * Does NOT control the theme — use cycleAppearance() for that.
 */

import { useSyncExternalStore } from "react";

function getSnapshot(): boolean {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot(): boolean {
  return false;
}

let listeners: Array<() => void> = [];

let observing = false;

function startObserver(): void {
  if (observing) return;
  observing = true;

  const observer = new MutationObserver(() => {
    listeners.forEach((l) => l());
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
}

function subscribe(listener: () => void): () => void {
  listeners = [...listeners, listener];
  startObserver();
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function useIsDark(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

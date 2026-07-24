/**
 * Icon registry — maps kebab-case icon names to Hugeicons icon data.
 *
 * Analogous to fieldRegistry for form fields. Consumers can register custom
 * icons without modifying icons.ts (Open/Closed principle).
 *
 * Default icons are registered by registerDefaultIcons().
 */

import type { IconSvgElement } from "@hugeicons/react";

import type { NavigationEntityType } from "@/contracts/navigation";

/**
 * The maps live on globalThis so the registry stays ONE registry even when this
 * module is instantiated more than once.
 *
 * The package publishes this file twice: inlined into dist-lib/middag-react.js by
 * the main build, and again as dist-lib/base/utils/icon-registry.js by the
 * subpaths build — the copy every ./reui/* and ./shell/* subpath imports. A
 * consumer that mixes `.` and subpath imports (anyone pairing this engine with
 * @middag-io/react-pro or @middag-io/react-demo) loads both, and bundlers keep
 * them apart: the barrel gets prebundled while the subpaths are served through a
 * separate pipeline, so neither `resolve.dedupe` nor a shared relative path
 * collapses them. registerDefaultIcons() would fill map A while the shell
 * partials rendering the nav resolved against map B, and every nav item fell back
 * to a single generic glyph.
 *
 * Keying off globalThis sidesteps module identity entirely — the same trick
 * styled-components and the React DevTools hook use. The key carries the schema
 * version: bump it only if the stored shape changes.
 */
const REGISTRY_KEY = "__MIDDAG_ICON_REGISTRY_V1__";

interface IconRegistryStore {
  icons: Map<string, IconSvgElement>;
  entityIcons: Map<string, IconSvgElement>;
}

const globalScope = globalThis as typeof globalThis & {
  [REGISTRY_KEY]?: IconRegistryStore;
};

const store: IconRegistryStore = (globalScope[REGISTRY_KEY] ??= {
  icons: new Map<string, IconSvgElement>(),
  entityIcons: new Map<string, IconSvgElement>(),
});

const iconMap = store.icons;
const entityIconMap = store.entityIcons;

/**
 * Register an icon for a given kebab-case name.
 */
export function registerIcon(name: string, icon: IconSvgElement): void {
  iconMap.set(name, icon);
}

/**
 * Register an icon for a given entity type (navigation entity resolution).
 */
export function registerEntityIcon(entityType: NavigationEntityType, icon: IconSvgElement): void {
  entityIconMap.set(entityType, icon);
}

/**
 * Resolve an icon by kebab-case name. Returns undefined if not registered.
 */
export function resolveIcon(name: string): IconSvgElement | undefined {
  return iconMap.get(name);
}

/**
 * Resolve an icon by entity type. Returns undefined if not registered.
 */
export function resolveEntityIcon(entityType: string): IconSvgElement | undefined {
  return entityIconMap.get(entityType);
}

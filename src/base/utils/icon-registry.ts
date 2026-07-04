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

const iconMap = new Map<string, IconSvgElement>();
const entityIconMap = new Map<string, IconSvgElement>();

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

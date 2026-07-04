/**
 * Icon resolution utility — resolves kebab-case icon names to Hugeicons icon data.
 *
 * Blocks receive icon names as strings from the server; this util resolves them.
 * Delegates to the icon registry populated by registerDefaultIcons().
 *
 * @see NV-05-ux-blocks.md — blocks reference icons by kebab-case name
 */

import { InboxIcon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

import { resolveIcon } from "./icon-registry";

/** Hugeicons icon data type — same as IconSvgElement from @hugeicons/react */
export type IconData = IconSvgElement;

/**
 * Resolve a Hugeicons icon from its kebab-case name.
 * Falls back to InboxIcon if not found.
 */
export function getIcon(name: string): IconData {
  return resolveIcon(name) ?? InboxIcon;
}

/**
 * Check if an icon name is registered.
 */
export function hasIcon(name: string): boolean {
  return resolveIcon(name) !== undefined;
}

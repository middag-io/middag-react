/**
 * Registries (ADR-807) — closed, versioned maps from page-contract types
 * to React components.
 *
 * shellRegistry: shell key → React component
 * layoutRegistry: layout template → React component
 * blockRegistry: block type → React component
 *
 * Feature pages and backend controllers can only reference keys present
 * in these registries. Never import vendor components directly from pages.
 */

import type { ComponentType, ReactElement, ReactNode } from "react";

import type { BlockDescriptor, LayoutDescriptor } from "@/contracts/page-contract";

export type ShellProps = {
  children: ReactNode;
};

export type LayoutProps = {
  layout: LayoutDescriptor;
  renderBlock: (block: BlockDescriptor) => ReactElement | null;
};

export type BlockProps<TData = Record<string, unknown>> = {
  block: BlockDescriptor<TData>;
};

export const shellRegistry = new Map<string, ComponentType<ShellProps>>();

export const layoutRegistry = new Map<string, ComponentType<LayoutProps>>();

export const blockRegistry = new Map<string, ComponentType<BlockProps>>();

export function registerShell(key: string, component: ComponentType<ShellProps>): void {
  shellRegistry.set(key, component);
}

export function registerLayout(key: string, component: ComponentType<LayoutProps>): void {
  layoutRegistry.set(key, component);
}

export function registerBlock<TData = Record<string, unknown>>(
  key: string,
  component: ComponentType<BlockProps<TData>>,
): void {
  blockRegistry.set(key, component as ComponentType<BlockProps>);
}

export function resolveShell(key: string): ComponentType<ShellProps> | undefined {
  const component = shellRegistry.get(key);
  // DEV-only diagnostic: statically dead-code-eliminated in the production lib
  // build, so no console.warn ships in dist-lib.
  if (!component && import.meta.env.DEV) {
    const available = [...shellRegistry.keys()].join(", ");
    console.warn(
      `[@middag-io/react] Shell "${key}" not registered.` +
        (available
          ? ` Available shells: ${available}.`
          : " No shells registered — did you call registerDefaults()?") +
        " Docs: https://ui-docs.middag.io/reference/shells",
    );
  }
  return component;
}

export function resolveLayout(key: string): ComponentType<LayoutProps> | undefined {
  const component = layoutRegistry.get(key);
  if (!component && import.meta.env.DEV) {
    const available = [...layoutRegistry.keys()].join(", ");
    console.warn(
      `[@middag-io/react] Layout "${key}" not registered.` +
        (available
          ? ` Available layouts: ${available}.`
          : " No layouts registered — did you call registerDefaults()?") +
        " Docs: https://ui-docs.middag.io/reference/layouts",
    );
  }
  return component;
}

export function resolveBlock(key: string): ComponentType<BlockProps> | undefined {
  const component = blockRegistry.get(key);
  if (!component && import.meta.env.DEV) {
    const available = [...blockRegistry.keys()].join(", ");
    console.warn(
      `[@middag-io/react] Block type "${key}" not registered.` +
        (available
          ? ` Available blocks: ${available}.`
          : " No blocks registered — did you call registerDefaults()?") +
        " Docs: https://ui-docs.middag.io/reference/blocks",
    );
  }
  return component;
}

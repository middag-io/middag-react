/**
 * Page Contract — composed wire types.
 *
 * The wire shape comes from `middag-php-ui` value objects, generated into
 * `@/contracts/generated`. This file refines those canonical types into the
 * public contract the runtime renders (i18n-aware actions, typed block data).
 *
 * Pro overlays — page chrome (badge, meta, filter tabs), contextual help,
 * inspector, the action `display` channel, and the `Pro*` page contract — live in
 * `@middag-io/react-pro`, composed OVER these base types. The Community engine ships
 * the lean wire shape only. Dependency direction is one-way: react-pro → react.
 */

import type { Action } from "@/contracts/block-data";
import type {
  BlockDescriptor as WireBlockDescriptor,
  Breadcrumb as WireBreadcrumb,
  LayoutDescriptor as WireLayoutDescriptor,
  PageContract as WirePageContract,
  PageMeta as WirePageMeta,
  PageResources as WirePageResources,
} from "@/contracts/generated";

// ── Composed wire types ──────────────────────────────────────────────────────

/** Breadcrumb — canonical (i18n-aware label, external flag). */
export type Breadcrumb = WireBreadcrumb;

/** Page-level action button — the canonical Action (DA-05). */
export type PageAction = Action;

export type PageMeta = Omit<WirePageMeta, "actions"> & {
  actions?: PageAction[];
};

export type BlockDescriptor<TData = Record<string, unknown>> = Omit<
  WireBlockDescriptor,
  "data" | "actions"
> & {
  data: TData;
  actions?: PageAction[];
};

export type LayoutDescriptor = Omit<WireLayoutDescriptor, "regions"> & {
  regions: Record<string, BlockDescriptor[]>;
};

/** Page resources — canonical php-ui shape. */
export type PageResources = WirePageResources;

export type PageContract = Omit<WirePageContract, "page" | "layout" | "resources"> & {
  page: PageMeta;
  layout: LayoutDescriptor;
  resources?: PageResources;
  // `entities` (entity type → route pattern) now rides on the generated
  // WirePageContract — sourced from the middag-php-ui PageContract VO.
};

// ── Extended Inertia props (sent alongside the contract, not inside it) ──────

/**
 * Inertia props shape for ContractPage. `overlay` toggles a full-screen overlay.
 * Pro props (help, inspector) are added by @middag-io/react-pro.
 */
export interface ContractPageProps {
  contract: PageContract;
  /** When true, page renders in a full-screen overlay with X close. */
  overlay?: boolean;
  /**
   * Shell rendering mode:
   * - `"full"` (default): resolve and mount the contract's shell around the
   *   layout — the standalone/self-contained rendering used by Inertia pages.
   * - `"content-only"`: render only `EntityRoutesProvider + Layout`, WITHOUT
   *   the shell. For hosts that mount a persistent shell once (e.g. a React
   *   Router layout route) and swap page content beneath it, avoiding the shell
   *   remount that flashes the sidebar on every navigation.
   */
  shellMode?: "full" | "content-only";
}

/**
 * Block data contracts — typed data shapes for the ADR-807 block types.
 *
 * Imported by block components for BlockProps<TData> type parameter.
 * These mirror the JSON shapes sent from PHP controllers via Inertia.
 *
 * @see ADR-807 ref/page-contract-v1 §5
 * @see NV-05-ux-blocks.md
 */

export * from "./actions";
export * from "./shared";
export * from "./form";
export * from "./data-display";
export * from "./interactive";

/**
 * Shared types used across multiple block data contracts.
 *
 * Contains entity references, form conditions, validation rules,
 * and other primitives that are imported by actions, form, data-display,
 * and interactive modules.
 */

// ── EntityRef (shared by columns and fields that link to navigable entities) ─

/** Reference to a navigable entity. Resolved via PageContract.entities map. */
export interface EntityRef {
  /** Entity type key (matches a key in PageContract.entities). */
  type: string;
  /** Field name in the row/record that contains the entity's ID value. */
  id: string;
}

// ── Form conditions & validation ────────────────────────────────────────────

// Generated from middag-php-ui (the canonical wire contract). Re-exported here
// so the public names stay stable; the codegen is the single source of truth.
export type {
  FormCondition,
  FormFieldDocumentMask,
  FormFieldValidation,
} from "@/contracts/generated";

export interface FormFieldEntityOption {
  value: string;
  label: string;
  subtitle?: string;
  avatarUrl?: string;
}

// ── Empty state (shared by blocks with empty states) ────────────────────────

/** Shared empty state configuration used by blocks with empty states. */
export interface EmptyStateDef {
  icon?: string;
  title?: string;
  description?: string;
  cta?: { label: string; href: string };
}

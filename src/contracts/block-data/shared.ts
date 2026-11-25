/**
 * Shared types used across multiple block data contracts.
 *
 * Contains entity references, form conditions, validation rules,
 * and other primitives that are imported by actions, form, data-display,
 * and interactive modules.
 */

// ── EntityRef (shared by columns and fields that link to navigable entities) ─

export type { EntityRef } from "@/contracts/generated";

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

export type { EmptyStateDef } from "@/contracts/generated";

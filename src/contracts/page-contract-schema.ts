/**
 * Zod schema for PageContract runtime validation.
 *
 * Used by ContractPage to validate contracts received from the backend before
 * rendering. The schema is the canonical wire shape generated from
 * `middag-php-ui` (single source of truth) — see `@/contracts/generated`.
 *
 * DA-03: the host-extensible parts are validated loosely. The generated core is
 * already lenient on unknown keys (Pro overlay + forward-compat fields are
 * stripped, not rejected); on top of that, `resources` is relaxed to a
 * permissive record because hosts patch it (preferences/capabilities/branding)
 * and the React Pro overlay (auth/locale) rides alongside.
 */

import { z } from "zod";

import { pageContractSchemaCore } from "@/contracts/generated";

export const pageContractSchema = pageContractSchemaCore.extend({
  resources: z.record(z.string(), z.unknown()).optional(),
});

export type PageContractValidationError = {
  field: string;
  message: string;
};

/**
 * Validate a PageContract shape. Returns null if valid, or an array of
 * validation errors if invalid.
 */
export function validatePageContract(contract: unknown): PageContractValidationError[] | null {
  const result = pageContractSchema.safeParse(contract);
  if (result.success) return null;

  return result.error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}

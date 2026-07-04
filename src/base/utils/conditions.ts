/**
 * Shared condition evaluation for FormPanelBlock and DenseTableBlock.
 * Extracted from FormPanelBlock to enable reuse across block types.
 */

import type { FormCondition } from "@/contracts/block-data";

export function evaluateCondition(
  condition: FormCondition,
  data: Record<string, unknown>,
): boolean {
  const fieldValue = data[condition.field];
  const condValue = condition.value;

  switch (condition.operator) {
    case "equals":
      return String(fieldValue) === String(condValue);
    case "not_equals":
      return String(fieldValue) !== String(condValue);
    case "in":
      return Array.isArray(condValue) && condValue.includes(String(fieldValue));
    case "not_in":
      return Array.isArray(condValue) && !condValue.includes(String(fieldValue));
    default:
      return true;
  }
}

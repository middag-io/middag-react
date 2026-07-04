/**
 * Form utility functions shared between FormPanelBlock and form-schema-builder.
 */

import { evaluateCondition } from "@/base/utils/conditions";
import type { FormFieldNode, FormSchemaNode } from "@/contracts/block-data";

/**
 * Extract all field nodes from a recursive schema tree.
 */
export function extractFields(nodes: FormSchemaNode[]): FormFieldNode[] {
  const fields: FormFieldNode[] = [];
  for (const node of nodes) {
    if (node.kind === "field") {
      fields.push(node);
    } else if (node.kind === "section" || node.kind === "group") {
      fields.push(...extractFields(node.children));
    }
  }
  return fields;
}

/**
 * Check if a field is visible given current form values.
 * Headers are always visible (they have no conditional props).
 */
export function isFieldVisible(field: FormFieldNode, values: Record<string, unknown>): boolean {
  if (field.component === "header") return true;
  const { props } = field;
  if (props.hidden_when && evaluateCondition(props.hidden_when, values)) {
    return false;
  }
  if (props.visible_when && !evaluateCondition(props.visible_when, values)) {
    return false;
  }
  return true;
}

/**
 * Check if a field is disabled given current form values.
 * Combines the static `disabled` prop with the conditional `disabled_when` rule.
 * Headers are never disabled (they have no conditional props).
 */
export function isFieldDisabled(field: FormFieldNode, values: Record<string, unknown>): boolean {
  if (field.component === "header") return false;
  const { props } = field;
  if (props.disabled) return true;
  if (props.disabled_when && evaluateCondition(props.disabled_when, values)) {
    return true;
  }
  return false;
}

/**
 * Check if a field is required given current form values.
 * Combines the static `required` prop with the conditional `required_when` rule.
 *
 * A disabled field is never treated as required: the user cannot fill it, so
 * enforcing required would make the form impossible to submit (UX deadlock).
 * Headers are never required.
 */
export function isFieldRequired(field: FormFieldNode, values: Record<string, unknown>): boolean {
  if (field.component === "header") return false;
  if (isFieldDisabled(field, values)) return false;
  const { props } = field;
  if (props.required) return true;
  if (props.required_when && evaluateCondition(props.required_when, values)) {
    return true;
  }
  return false;
}

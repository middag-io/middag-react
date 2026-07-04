/**
 * Field component registry — maps FormFieldType keys to React components.
 *
 * Analogous to blockRegistry for blocks. Consumers can register custom field
 * components without modifying FormField.tsx (Open/Closed principle).
 *
 * Default field components are registered by registerDefaultFields().
 */

import type { ComponentType } from "react";

/**
 * Props that every registered field component receives.
 *
 * Field-specific props (documentType, currency, etc.) are passed via the
 * `fieldProps` bag — each component extracts what it needs.
 */
export interface FieldComponentProps {
  id: string;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  helpTextId: string;
  errorId: string;
  disabled?: boolean;
  required?: boolean;
  /** Full field props bag — field components extract type-specific props. */
  fieldProps: Record<string, unknown>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- registry stores heterogeneous field components
const fieldRegistry = new Map<string, ComponentType<any>>();

/**
 * Register a field component for a given field type key.
 *
 * The component receives the same props as built-in field components
 * (id, value, onChange, error, etc.). Use `FieldComponentProps` as a
 * baseline, but specific fields may have additional typed props.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- field components have heterogeneous props
export function registerFieldComponent(type: string, component: ComponentType<any>): void {
  fieldRegistry.set(type, component);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- field components have heterogeneous props
export function resolveFieldComponent(type: string): ComponentType<any> | undefined {
  return fieldRegistry.get(type);
}

export function getRegisteredFieldTypes(): string[] {
  return [...fieldRegistry.keys()];
}

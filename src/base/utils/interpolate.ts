/**
 * Interpolates {field} placeholders in a template string with values from a data record.
 * Used for row action href and confirmation message interpolation.
 * Example: interpolate('/api/{id}/process', { id: 42 }) -> '/api/42/process'
 */

export function interpolate(template: string, data: Record<string, unknown>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(data[key] ?? ""));
}

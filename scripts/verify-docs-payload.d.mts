/**
 * Hand-written declarations for verify-docs-payload.mjs (plain-JS CLI), so
 * the vitest suite (tests/scripts/) can import the pure helpers with real
 * types instead of a ts-ignore.
 */
export interface ForbiddenPattern {
  re: RegExp;
  label: string;
}

export interface PayloadViolation {
  path: string;
  label: string;
}

export const FORBIDDEN: ForbiddenPattern[];
export function listPayloadFiles(dir: string, base?: string): string[];
export function findViolations(dist: string): PayloadViolation[];
export function verifyDocsPayload(dist: string): void;

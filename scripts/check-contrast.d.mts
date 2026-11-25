/**
 * Hand-written declarations for check-contrast.mjs (plain-JS CLI), so the
 * vitest suite (tests/scripts/) can import the helpers with real types.
 */
export type Mode = "light" | "dark";
export type Pair = [fg: string, bg: string, modes?: Mode[]];
export type Oklch = [l: number, c: number, h: number];
export type Linear = [r: number, g: number, b: number];

export interface Themes {
  light: Record<string, Oklch>;
  dark: Record<string, Oklch>;
}

export interface PairResult {
  mode: Mode;
  kind: "text" | "ui";
  fg: string;
  bg: string;
  ratio: number;
  min: number;
  pass: boolean;
}

export const DEFAULT_TOKENS: string;
export const TEXT_MIN: number;
export const UI_MIN: number;
export const TEXT_PAIRS: Pair[];
export const UI_PAIRS: Pair[];
export function contrastRatio(a: Linear, b: Linear): number;
export function parseThemes(css: string, base?: Themes | null): Themes;
export function resolve(tokens: Record<string, Oklch>, expr: string): Linear;
export function measure(
  css: string,
  options?: { base?: Themes | null; textPairs?: Pair[]; uiPairs?: Pair[] },
): PairResult[];

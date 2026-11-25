/**
 * Theme contrast gate (scripts/check-contrast.mjs).
 *
 * Every text pair the components render must reach WCAG AA (4.5:1) and the
 * focus ring 3:1, in light and dark mode, for the default tokens and for the
 * bundled classic theme layered on top of them.
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  contrastRatio,
  DEFAULT_TOKENS,
  measure,
  parseThemes,
  resolve,
} from "../../scripts/check-contrast.mjs";

const root = path.resolve(__dirname, "../..");
const read = (file: string) => readFileSync(path.join(root, file), "utf8");

describe("check-contrast", () => {
  it("measures black on white as 21:1 and white on white as 1:1", () => {
    // Arrange
    const tokens = {
      black: [0, 0, 0] as [number, number, number],
      white: [1, 0, 0] as [number, number, number],
    };

    // Act
    const max = contrastRatio(resolve(tokens, "black"), resolve(tokens, "white"));
    const min = contrastRatio(resolve(tokens, "white"), resolve(tokens, "white"));

    // Assert
    expect(max).toBeCloseTo(21, 1);
    expect(min).toBe(1);
  });

  it("flags a pair below the minimum", () => {
    const css = ":root { --fg: oklch(0.8 0 0); --bg: oklch(1 0 0); }";

    const rows = measure(css, { textPairs: [["fg", "bg"]], uiPairs: [] });

    expect(rows).toHaveLength(2);
    expect(rows.every((r) => !r.pass)).toBe(true);
  });

  it("keeps a theme's light value in dark mode unless its dark block redeclares it", () => {
    const base = parseThemes(":root { --a: oklch(0.5 0 0); } :root.dark { --a: oklch(0.2 0 0); }");

    const themes = parseThemes(".theme-x { --a: oklch(0.9 0 0); }", base);

    expect(themes.light.a).toEqual([0.9, 0, 0]);
    expect(themes.dark.a).toEqual([0.9, 0, 0]);
  });

  it("every text pair of the default tokens reaches AA in light and dark mode", () => {
    const failures = measure(read(DEFAULT_TOKENS)).filter((r) => !r.pass);

    expect(failures).toEqual([]);
  });

  it("every text pair of the classic theme reaches AA on top of the default tokens", () => {
    const base = parseThemes(read(DEFAULT_TOKENS));

    const failures = measure(read("src/base/theme/themes/classic.css"), { base }).filter(
      (r) => !r.pass,
    );

    expect(failures).toEqual([]);
  });
});

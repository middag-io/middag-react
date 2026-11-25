#!/usr/bin/env node
/**
 * check-contrast.mjs — WCAG contrast gate for the theme tokens.
 *
 * Reads the light (`:root`) and dark (`:root.dark`) blocks of a token file
 * (default: src/base/theme/tokens.css), resolves every `oklch()` value to sRGB
 * and measures the WCAG 2.x contrast ratio of each text/background pair the
 * library actually renders. Text pairs must reach 4.5:1 (AA, normal text);
 * non-text UI pairs (focus ring) must reach 3:1 (WCAG 1.4.11).
 *
 * Pairs may be plain tokens or derived colors:
 *   - "token"                 the token value
 *   - "token/10@surface"      the token at 10% alpha composited on `surface`
 *                             (Tailwind `bg-token/10` over that surface)
 *   - "mix(a,b,40)"           color-mix(in oklab, a, b 40%)
 *
 * Usage:
 *   node scripts/check-contrast.mjs [tokens.css ...] [--json]
 * Exits 1 when any pair is below its minimum.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const DEFAULT_TOKENS = "src/base/theme/tokens.css";
export const TEXT_MIN = 4.5;
export const UI_MIN = 3;

/**
 * Text pairs: [foreground, background, modes?]. A pair is measured in light
 * and dark mode unless `modes` limits it. Keep this list in sync with the
 * utilities the components use.
 */
export const TEXT_PAIRS = [
  // Canvas and overlays
  ["foreground", "background"],
  ["card-foreground", "card"],
  ["popover-foreground", "popover"],
  // Muted text on every surface it is rendered on
  ["muted-foreground", "background"],
  ["muted-foreground", "card"],
  ["muted-foreground", "popover"],
  ["muted-foreground", "muted"],
  ["muted-foreground", "sidebar"],
  ["secondary-foreground", "secondary"],
  ["secondary-foreground", "background"],
  ["accent-foreground", "accent"],
  // Solid fills (buttons, solid badges)
  ["primary-foreground", "primary"],
  ["destructive-foreground", "destructive"],
  ["success-foreground", "success"],
  ["warning-foreground", "warning"],
  ["info-foreground", "info"],
  ["invert-foreground", "invert"],
  // Sidebar
  ["sidebar-foreground", "sidebar"],
  ["sidebar-primary-foreground", "sidebar-primary"],
  ["sidebar-accent-foreground", "sidebar-accent"],
  // Status text (`text-{status}-text`): status pills, annotated cells, badge
  // `*-light` (tinted fill: `/10`, `dark:/20`) and `*-outline` variants
  // (`bg-background`, `dark:bg-input/30`).
  ...["success", "warning", "info", "destructive"].flatMap((status) => [
    [`${status}-text`, "background"],
    [`${status}-text`, "card"],
    [`${status}-text`, `${status}-subtle`],
    [`${status}-text`, `${status}/10@background`, ["light"]],
    [`${status}-text`, `${status}/20@background`, ["dark"]],
    [`${status}-text`, "input/30@background", ["dark"]],
  ]),
  // Primary, destructive and invert as plain text (links, error messages) and
  // the badge `primary-light` and `invert-outline` variants.
  ["primary", "background"],
  ["primary", "card"],
  ["primary", "primary/10@background"],
  ["invert", "background"],
  ["invert", "input/30@background", ["dark"]],
  ["destructive", "background"],
  ["destructive", "card"],
];

/** Non-text UI pairs (WCAG 1.4.11, 3:1). */
export const UI_PAIRS = [["ring", "background"]];

// ── Color math ───────────────────────────────────────────────────────────────

/** oklch(L C H) → OKLab [L, a, b]. */
function oklchToOklab([l, c, h]) {
  const rad = (h * Math.PI) / 180;
  return [l, c * Math.cos(rad), c * Math.sin(rad)];
}

/** OKLab → linear sRGB (Björn Ottosson's reference matrices), clamped. */
function oklabToLinearSrgb([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => Math.min(1, Math.max(0, v)));
}

const toGamma = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
const toLinear = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);

/** Relative luminance (WCAG) of a linear sRGB triple. */
function luminance([r, g, b]) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(linA, linB) {
  const [hi, lo] = [luminance(linA), luminance(linB)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// ── Token parsing ────────────────────────────────────────────────────────────

const OKLCH_RE = /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)$/;

/** Parses `--name: oklch(...)` declarations of one CSS block body. */
function parseBlock(body) {
  const tokens = {};
  for (const match of body.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    const value = match[2].trim();
    const okl = OKLCH_RE.exec(value);
    if (okl) tokens[match[1]] = okl.slice(1, 4).map(Number);
  }
  return tokens;
}

/** Returns the body of the first block whose selector list starts with `selector`. */
function blockBody(css, selectorRe) {
  const match = selectorRe.exec(css);
  if (!match) return null;
  const start = css.indexOf("{", match.index) + 1;
  let depth = 1;
  let i = start;
  while (depth > 0 && i < css.length) {
    if (css[i] === "{") depth += 1;
    else if (css[i] === "}") depth -= 1;
    i += 1;
  }
  return css.slice(start, i - 1);
}

/**
 * Light and dark token maps of a token file. Dark inherits every light token
 * it does not redeclare (the dark block only overrides). With `base`, the file
 * is an overlay (a `.theme-*` class) measured on top of the default tokens.
 */
export function parseThemes(css, base = null) {
  const lightBody = blockBody(css, /(^|\n)\s*(:root|\.theme-[a-z]+)\s*\{/);
  const darkBody = blockBody(css, /(^|\n)\s*:root\.dark[^{]*\{/);
  if (!lightBody) throw new Error("No light (:root or .theme-*) token block found");
  const ownLight = parseBlock(lightBody);
  const ownDark = darkBody ? parseBlock(darkBody) : {};
  // A theme class sets its light values on its own element, so in dark mode
  // they still win over the inherited :root.dark values unless its dark block
  // redeclares them.
  const light = { ...(base?.light ?? {}), ...ownLight };
  const dark = { ...(base?.dark ?? {}), ...ownLight, ...ownDark };
  return { light, dark };
}

// ── Color expressions ────────────────────────────────────────────────────────

function tokenLab(tokens, name) {
  const value = tokens[name];
  if (!value) throw new Error(`Unknown token --${name}`);
  return oklchToOklab(value);
}

/** Resolves a color expression to linear sRGB. */
export function resolve(tokens, expr) {
  const mix = /^mix\(([a-z0-9-]+),([a-z0-9-]+),(\d+)\)$/.exec(expr);
  if (mix) {
    const a = tokenLab(tokens, mix[1]);
    const b = tokenLab(tokens, mix[2]);
    const t = Number(mix[3]) / 100;
    return oklabToLinearSrgb(a.map((v, i) => v * (1 - t) + b[i] * t));
  }
  const alpha = /^([a-z0-9-]+)\/(\d+)@([a-z0-9-]+)$/.exec(expr);
  if (alpha) {
    // Alpha compositing happens on gamma-encoded sRGB in the browser.
    const top = oklabToLinearSrgb(tokenLab(tokens, alpha[1])).map(toGamma);
    const base = oklabToLinearSrgb(tokenLab(tokens, alpha[3])).map(toGamma);
    const t = Number(alpha[2]) / 100;
    return top.map((v, i) => toLinear(v * t + base[i] * (1 - t)));
  }
  return oklabToLinearSrgb(tokenLab(tokens, expr));
}

/** Measures every pair in both modes. */
export function measure(css, { base = null, textPairs = TEXT_PAIRS, uiPairs = UI_PAIRS } = {}) {
  const themes = parseThemes(css, base);
  const rows = [];
  for (const [mode, tokens] of Object.entries(themes)) {
    for (const [pairs, min, kind] of [
      [textPairs, TEXT_MIN, "text"],
      [uiPairs, UI_MIN, "ui"],
    ]) {
      for (const [fg, bg, modes] of pairs) {
        if (modes && !modes.includes(mode)) continue;
        const ratio = contrastRatio(resolve(tokens, fg), resolve(tokens, bg));
        // Truncate (never round up) so a displayed 4.50 always means >= 4.5.
        const shown = Math.floor(ratio * 100) / 100;
        rows.push({ mode, kind, fg, bg, ratio: shown, min, pass: ratio >= min });
      }
    }
  }
  return rows;
}

// ── CLI ──────────────────────────────────────────────────────────────────────

function main(argv) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const asJson = argv.includes("--json");
  const files = argv.filter((a) => !a.startsWith("--"));
  const targets = files.length ? files : [DEFAULT_TOKENS, "src/base/theme/themes/classic.css"];

  // A named theme (themes/*.css) only overrides some tokens: it is measured on
  // top of the default tokens, the way it renders.
  const read = (file) => readFileSync(path.resolve(root, file), "utf8");
  const defaults = parseThemes(read(DEFAULT_TOKENS));

  let failed = 0;
  const report = {};
  for (const file of targets) {
    const isOverlay = path.resolve(root, file) !== path.resolve(root, DEFAULT_TOKENS);
    const rows = measure(read(file), { base: isOverlay ? defaults : null });
    report[file] = rows;
    failed += rows.filter((r) => !r.pass).length;
    if (asJson) continue;
    console.log(`\n${file}`);
    for (const r of rows) {
      const mark = r.pass ? "ok  " : "FAIL";
      console.log(
        `  ${mark} ${r.mode.padEnd(5)} ${r.ratio.toFixed(2).padStart(5)}:1 (min ${r.min}) ${r.fg} on ${r.bg}`,
      );
    }
  }
  if (asJson) console.log(JSON.stringify({ failed, report }, null, 2));
  else console.log(failed ? `\n${failed} pair(s) below the minimum.` : "\nAll pairs pass.");
  return failed ? 1 : 0;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  process.exitCode = main(process.argv.slice(2));
}

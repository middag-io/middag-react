/**
 * ThemeContext — component-level theming for MIDDAG React.
 *
 * CSS custom properties handle colors, radius, shadows, and sizing.
 * But some visual differences between themes require component-level
 * variant selection (e.g., enterprise uses outline badges, soft uses
 * pill badges). This context provides those overrides.
 *
 * If no MIDDAGThemeProvider wraps the tree, useThemeOverrides() returns
 * 'classic' defaults — safe to call unconditionally.
 */

import { createContext, useContext, useMemo, type ReactNode } from "react";

// ── Theme IDs ───────────────────────────────────────────────────────────────

export type ThemeId = "classic" | "enterprise" | "soft" | "midnight";

// eslint-disable-next-line react-refresh/only-export-components
export const THEME_IDS: ThemeId[] = ["classic", "enterprise", "soft", "midnight"];

// ── Component overrides ─────────────────────────────────────────────────────

export interface BadgeOverrides {
  variant: "default" | "outline" | "soft";
  rounded: boolean;
}

export interface ButtonOverrides {
  size: "default" | "sm";
}

export interface TabsOverrides {
  variant: "default" | "line" | "pill";
}

export interface TableOverrides {
  density: "compact" | "comfortable" | "spacious";
  stripedRows: boolean;
}

export interface CardOverrides {
  bordered: boolean;
}

export interface ThemeOverrides {
  id: ThemeId;
  badge: BadgeOverrides;
  button: ButtonOverrides;
  tabs: TabsOverrides;
  table: TableOverrides;
  card: CardOverrides;
}

// ── Override definitions per theme ──────────────────────────────────────────

const THEME_OVERRIDES: Record<ThemeId, ThemeOverrides> = {
  classic: {
    id: "classic",
    badge: { variant: "default", rounded: false },
    button: { size: "default" },
    tabs: { variant: "default" },
    table: { density: "comfortable", stripedRows: false },
    card: { bordered: false },
  },
  enterprise: {
    id: "enterprise",
    badge: { variant: "outline", rounded: false },
    button: { size: "sm" },
    tabs: { variant: "line" },
    table: { density: "compact", stripedRows: true },
    card: { bordered: true },
  },
  soft: {
    id: "soft",
    badge: { variant: "soft", rounded: true },
    button: { size: "default" },
    tabs: { variant: "pill" },
    table: { density: "spacious", stripedRows: false },
    card: { bordered: false },
  },
  midnight: {
    id: "midnight",
    badge: { variant: "outline", rounded: false },
    button: { size: "sm" },
    tabs: { variant: "line" },
    table: { density: "compact", stripedRows: false },
    card: { bordered: true },
  },
};

// ── Context ─────────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeOverrides>(THEME_OVERRIDES.classic);

/**
 * Read component-level theme overrides.
 * Safe to call without a provider — returns classic defaults.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useThemeOverrides(): ThemeOverrides {
  return useContext(ThemeContext);
}

/**
 * Get the ThemeOverrides for a given ThemeId without a provider.
 * Useful in SSR or outside the React tree.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function getThemeOverrides(id: ThemeId): ThemeOverrides {
  return THEME_OVERRIDES[id];
}

// ── CSS class for <body> ────────────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
export const THEME_CLASSES: Record<ThemeId, string> = {
  classic: "theme-classic",
  enterprise: "theme-enterprise",
  soft: "theme-soft",
  midnight: "theme-midnight",
};

// ── Sidebar dimensions per theme ────────────────────────────────────────────
// eslint-disable-next-line react-refresh/only-export-components
export const THEME_SIDEBAR_DIMS: Record<ThemeId, { width: string; icon: string }> = {
  classic: { width: "260px", icon: "60px" },
  enterprise: { width: "248px", icon: "56px" },
  soft: { width: "272px", icon: "64px" },
  midnight: { width: "240px", icon: "52px" },
};

// ── Provider ────────────────────────────────────────────────────────────────

interface MIDDAGThemeProviderProps {
  theme: ThemeId;
  children: ReactNode;
}

export function MIDDAGThemeProvider({ theme, children }: MIDDAGThemeProviderProps) {
  const overrides = useMemo(() => THEME_OVERRIDES[theme], [theme]);
  return <ThemeContext value={overrides}>{children}</ThemeContext>;
}

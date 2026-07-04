/**
 * SharedProps — typed Inertia shared props sent on every request.
 *
 * PHP side: inertia_manager::share() in http_kernel boot.
 * Frontend: usePage<SharedProps>().props
 *
 * @see NV-05-ux-shell-sidebar.md §1.3
 */

import type { NavigationTreePayload } from "@/contracts/navigation";

export interface SharedPropsAuth {
  /** Moodle user ID */
  id: number;
  /** Full display name */
  name: string;
  /** Email address */
  email: string;
  /** URL to user avatar (Moodle profile picture) */
  avatarUrl?: string;
  /** Array of Moodle capability strings the user holds in current context */
  capabilities: string[];
  /** Logout URL (Moodle sesskey-signed). Present when the host injects it. */
  logoutUrl?: string;
}

export interface SharedPropsTheme {
  /** Pre-loaded i18n strings for the current page (key → translated string) */
  strings?: Record<string, string>;
  /**
   * Current appearance preference: 'system' | 'light' | 'dark'.
   * Sent from server to sync cross-device. Client reads localStorage first.
   */
  appearance?: "system" | "light" | "dark";
  /**
   * Moodle brand color (hex, e.g. "#1177d1").
   * Present when local_middag/inherit_theme_colors = ON.
   * PHP injects :root { --middag-brand: <value> } in page head.
   */
  brandColor?: string;
  /** Whether Moodle theme color inheritance is active */
  inherit?: boolean;
}

export interface SharedPropsFlash {
  /** Success message to show as toast */
  success?: string;
  /** Error message to show as toast */
  error?: string;
  /** Info message to show as toast */
  info?: string;
  /** Warning message to show as toast */
  warning?: string;
  toast?: {
    severity: "success" | "error" | "warning" | "info";
    message: string;
    duration?: number;
  };
}

export interface AdminTabItem {
  key: string;
  label: string;
  href: string;
}

export interface AdminTabsProps {
  active: string;
  items: AdminTabItem[];
}

export interface SharedProps {
  navigation: NavigationTreePayload;
  /**
   * Authenticated user. Optional/null on guest-facing pages (e.g. login) where
   * no user is established yet. AuthProvider tolerates its absence: `user` is
   * null, `isAuthenticated` false, and every capability check returns false.
   */
  auth?: SharedPropsAuth | null;
  theme: SharedPropsTheme;
  flash?: SharedPropsFlash;
  /** Effective locale string, e.g. "pt-BR", "en" */
  locale: string;
  /** MIDDAG version string, e.g. "5.0.0" */
  version: string;
  /** Global scope data from global_scope_manager (extensions add their keys) */
  scope?: Record<string, unknown>;
  /** CSRF/session token (Moodle sesskey) for state-changing requests. */
  csrf_token?: string;
  /** Index signature required by Inertia's PageProps constraint (usePage<SharedProps>()). */
  [key: string]: unknown;
}

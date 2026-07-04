/**
 * Lottie animation catalog — organized by theme.
 *
 * Each theme has 2-3 animation variants as local JSON paths.
 * Use with @lottiefiles/dotlottie-react:
 *
 * @example
 * import { DotLottieReact } from '@lottiefiles/dotlottie-react';
 * import { lottie } from '@/assets/lottie';
 *
 * <DotLottieReact src={lottie.loading[0]} loop autoplay />
 */

// Asset paths — served from public/lottie/ (symlinked to src/assets/lottie/).
// In production (Moodle AMD), the host overrides base via lottieBasePath config.
const base = "/lottie";

function paths(theme: string, files: string[]): string[] {
  return files.map((f) => `${base}/${theme}/${f}`);
}

export const lottie = {
  loading: paths("loading", ["spinner-1.json", "spinner-2.json", "spinner-3.json"]),
  success: paths("success", ["check-1.json", "check-2.json", "check-3.json"]),
  error: paths("error", ["warning-1.json", "warning-2.json", "warning-3.json"]),
  emptyState: paths("empty-state", ["empty-1.json", "empty-2.json", "empty-3.json"]),
  notFound: paths("not-found", ["404-1.json", "404-2.json", "404-3.json"]),
  search: paths("search", ["search-1.json", "search-2.json", "search-3.json"]),
  upload: paths("upload", ["upload-1.json", "upload-2.json", "upload-3.json"]),
  notification: paths("notification", ["bell-1.json", "bell-2.json", "bell-3.json"]),
  email: paths("email", ["mail-1.json", "mail-2.json", "mail-3.json"]),
  settings: paths("settings", ["gear-1.json", "gear-2.json", "gear-3.json"]),
  user: paths("user", ["profile-1.json", "profile-2.json", "profile-3.json"]),
  dashboard: paths("dashboard", ["analytics-1.json", "analytics-2.json", "analytics-3.json"]),
  calendar: paths("calendar", ["schedule-1.json", "schedule-2.json"]),
  security: paths("security", ["lock-1.json", "lock-2.json", "lock-3.json"]),
  payment: paths("payment", ["wallet-1.json", "wallet-2.json", "wallet-3.json"]),
  cloud: paths("cloud", ["cloud-1.json", "cloud-2.json"]),
  connection: paths("connection", ["network-1.json", "network-2.json", "network-3.json"]),
  celebration: paths("celebration", ["confetti-1.json", "confetti-2.json", "confetti-3.json"]),
  onboarding: paths("onboarding", ["welcome-1.json", "welcome-2.json", "welcome-3.json"]),
  maintenance: paths("maintenance", [
    "construction-1.json",
    "construction-2.json",
    "construction-3.json",
  ]),
} as const;

export type LottieTheme = keyof typeof lottie;

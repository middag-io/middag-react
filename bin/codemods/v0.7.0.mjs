/**
 * v0.7.0 codemod: i18n defaults, error telemetry, mock exports, open contract types
 *
 * No breaking changes — inform user about new features.
 */

/* global console */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function migrate(_projectRoot) {
  console.log([
    "  No breaking changes in v0.7.0",
    "  New features available:",
    "    - LIB_UI_DEFAULTS: override lib UI strings via I18nProvider",
    "    - ErrorReporterProvider: plug Sentry/New Relic for error telemetry",
    "    - @middag-io/react/mock: extend the mock SPA (GitHub Packages only)",
    "    - Custom shell/layout types: register your own shells and layouts",
  ].join("\n"));
}

export const description = "i18n defaults, error telemetry, mock exports, open contract types";

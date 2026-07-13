/**
 * Provider barrel — re-exports all providers for convenient imports.
 *
 * Consumers can import from "@/engine/providers" instead of individual files.
 * i18n moved to the i18next stack — import I18nProvider/useTranslation/etc.
 * from the package root ("@middag-io/react") or "@/i18n/*".
 */

export { AuthProvider, useAuth, Can, Cannot } from "./auth";
export { FlashProvider } from "./flash";
export { ScopeProvider, useScope, useScopeKey, type ScopeContextValue } from "./scope";
export { ProgressProvider } from "./progress";
export {
  ErrorReporterProvider,
  useErrorReporter,
  type ErrorReporter,
  type ErrorContext,
} from "./error-reporter";

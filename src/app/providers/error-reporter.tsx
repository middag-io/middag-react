/**
 * ErrorReporter — pluggable error telemetry for lib components.
 *
 * The lib never depends on a specific error SDK. Consumers inject their
 * preferred reporter (Sentry, New Relic, Datadog, or console).
 *
 * @example
 * // Sentry integration
 * import * as Sentry from '@sentry/react';
 *
 * const sentryReporter: ErrorReporter = {
 *   captureError: (error, context) => Sentry.captureException(error, { extra: context }),
 *   captureMessage: (message, context) => Sentry.captureMessage(message, { extra: context }),
 * };
 *
 * <ErrorReporterProvider reporter={sentryReporter}>
 *   <App />
 * </ErrorReporterProvider>
 *
 * @example
 * // New Relic integration
 * const newRelicReporter: ErrorReporter = {
 *   captureError: (error, context) => newrelic.noticeError(error, context),
 *   captureMessage: (message, context) => newrelic.noticeError(new Error(message), context),
 * };
 *
 * @example
 * // No reporter — falls back to console.error (default)
 * <ErrorReporterProvider>
 *   <App />
 * </ErrorReporterProvider>
 */

import { createContext, useContext, type ReactNode } from "react";

export interface ErrorContext {
  /** Component or module that originated the error */
  component?: string;
  /** Block type key (e.g. 'dense_table') */
  block?: string;
  /** User action that triggered the error (e.g. 'form_submit') */
  action?: string;
  /** Arbitrary extra data */
  [key: string]: unknown;
}

export interface ErrorReporter {
  /** Report a caught Error object with optional context */
  captureError: (error: Error, context?: ErrorContext) => void;
  /** Report a message-level event (non-fatal) */
  captureMessage?: (message: string, context?: ErrorContext) => void;
}

const consoleReporter: ErrorReporter = {
  captureError: (error, context) => {
    console.error("[MIDDAG]", error, context);
  },
  captureMessage: (message, context) => {
    console.warn("[MIDDAG]", message, context);
  },
};

const ErrorReporterContext = createContext<ErrorReporter>(consoleReporter);

interface ErrorReporterProviderProps {
  children: ReactNode;
  reporter?: ErrorReporter;
}

export function ErrorReporterProvider({
  children,
  reporter = consoleReporter,
}: ErrorReporterProviderProps) {
  return <ErrorReporterContext value={reporter}>{children}</ErrorReporterContext>;
}

/**
 * Access the error reporter in any component.
 *
 * @example
 * const reporter = useErrorReporter();
 * try { ... } catch (err) {
 *   reporter.captureError(err as Error, { component: 'MyComponent' });
 * }
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useErrorReporter(): ErrorReporter {
  return useContext(ErrorReporterContext);
}

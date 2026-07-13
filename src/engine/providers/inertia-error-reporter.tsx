/**
 * InertiaErrorReporter — routes Inertia transport failures to telemetry + UX.
 *
 * Inertia v3 emits `httpException` (the server returned an error response) and
 * `networkError` (the request never completed). With no handler wired, both
 * vanish silently. This headless, pass-through component forwards them to the
 * injected {@link ErrorReporter} (telemetry) and surfaces a toast so the user
 * sees the failure.
 *
 * Mount it inside `ErrorReporterProvider` + `I18nProvider`, alongside the
 * `Toaster`. It owns no context — it only subscribes to router events.
 *
 * @example
 * <ErrorReporterProvider reporter={sentryReporter}>
 *   <I18nProvider>
 *     <InertiaErrorReporter>
 *       <App />
 *     </InertiaErrorReporter>
 *   </I18nProvider>
 * </ErrorReporterProvider>
 */

import { useEffect, type ReactNode } from "react";
import { router } from "@inertiajs/core";
import { toast } from "sonner";

import { useTranslation } from "@/i18n/useTranslation";

import { useErrorReporter } from "./error-reporter";

export function InertiaErrorReporter({ children }: { children: ReactNode }) {
  const reporter = useErrorReporter();
  const { t } = useTranslation();

  useEffect(() => {
    const offHttp = router.on("httpException", (event) => {
      const { status } = event.detail.response;
      reporter.captureError(new Error(`Inertia HTTP exception (${status})`), {
        component: "inertia",
        action: "httpException",
        status,
      });
      toast.error(t("middag.ui.errors.http"));
    });

    const offNetwork = router.on("networkError", (event) => {
      reporter.captureError(event.detail.error, {
        component: "inertia",
        action: "networkError",
      });
      toast.error(t("middag.ui.errors.network"));
    });

    return () => {
      offHttp();
      offNetwork();
    };
  }, [reporter, t]);

  return <>{children}</>;
}

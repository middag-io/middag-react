/**
 * I18nProvider — wraps the app with the library i18next instance, wires the
 * host async resolver, merges server-preloaded strings, and syncs the server
 * locale. In standalone mode (no server locale) the LanguageDetector
 * (localStorage) governs the locale instead.
 */
import { useEffect, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";
import { usePage } from "@inertiajs/react";

import { setHostStringResolver, type HostStringResolver } from "./host-resolver";
import { i18n, normalizeLocale, NS } from "./instance";

interface InertiaSharedProps {
  theme?: { strings?: Record<string, string> };
  locale?: string;
  [key: string]: unknown;
}

export interface I18nProviderProps {
  children: ReactNode;
  /** Host (Moodle/WP) per-key resolver for lazy strings. */
  asyncResolver?: HostStringResolver;
}

export function I18nProvider({ children, asyncResolver }: I18nProviderProps) {
  const { props } = usePage<InertiaSharedProps>();
  const serverStrings = props.theme?.strings;
  const serverLocale = props.locale ? normalizeLocale(props.locale) : undefined;

  useEffect(() => {
    setHostStringResolver(asyncResolver ?? null);
    return () => setHostStringResolver(null);
  }, [asyncResolver]);

  // Server-preloaded UI strings override the bundled defaults (server wins).
  useEffect(() => {
    if (serverStrings) {
      const lng = serverLocale ?? i18n.resolvedLanguage ?? i18n.language;
      i18n.addResourceBundle(lng, NS.ui, serverStrings, true, true);
    }
  }, [serverStrings, serverLocale]);

  // Host mode only: follow the server locale. Standalone (no server locale)
  // leaves the LanguageDetector/localStorage choice untouched.
  useEffect(() => {
    if (serverLocale && i18n.resolvedLanguage !== serverLocale) {
      void i18n.changeLanguage(serverLocale);
    }
  }, [serverLocale]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

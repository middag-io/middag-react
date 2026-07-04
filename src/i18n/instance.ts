/**
 * The library-owned i18next instance.
 *
 * Uses createInstance() so @middag-io/react never mutates a host app's global
 * i18next singleton. ICU plugin intentionally omitted (see plan D1): native
 * CLDR plurals + single-brace interpolation cover every need without the
 * untested i18next-icu@v26 combination.
 */
import { initReactI18next } from "react-i18next";
import { createInstance, type i18n as I18nInstance } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enUi from "./locales/en/ui.json";
import enValidators from "./locales/en/validators.json";
import ptBrUi from "./locales/pt-BR/ui.json";
import ptBrValidators from "./locales/pt-BR/validators.json";

/** Namespaces the library ships up front. Host components add their own at runtime. */
export const NS = { ui: "ui", validators: "validators" } as const;
export const FALLBACK_LNG = "en";
export const SUPPORTED_LNGS = ["en", "pt-BR"] as const;

/** Normalize a server locale ("pt_BR") to BCP-47 ("pt-BR"). */
export function normalizeLocale(raw: string | undefined): string {
  if (!raw) return FALLBACK_LNG;
  return raw.replace("_", "-");
}

export const i18n: I18nInstance = createInstance();

export const i18nReady: Promise<unknown> = i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: FALLBACK_LNG,
    ns: [NS.ui, NS.validators],
    defaultNS: NS.ui,
    supportedLngs: [...SUPPORTED_LNGS],
    // nonExplicitSupportedLngs intentionally omitted: with explicit BCP-47 codes in
    // supportedLngs (e.g. "pt-BR"), enabling it causes isSupportedCode to strip the
    // region suffix and fail the lookup. load:'currentOnly' + exact codes is sufficient.
    load: "currentOnly",

    // D4: keep flat dotted keys ("middag.ui.validation.required") verbatim.
    keySeparator: false,
    nsSeparator: ":",

    resources: {
      en: { ui: enUi, validators: enValidators },
      "pt-BR": { ui: ptBrUi, validators: ptBrValidators },
    },

    interpolation: {
      escapeValue: false, // React already escapes.
      prefix: "{", // D3: single-brace to match framework {param} + existing {min}.
      suffix: "}",
    },

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      lookupLocalStorage: "middag-locale",
      caches: ["localStorage"],
    },

    react: {
      useSuspense: false, // we re-render on store events, no Suspense boundary.
      bindI18nStore: "added", // D2: re-render when host strings arrive via addResource.
    },
  });

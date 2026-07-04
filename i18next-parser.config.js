/** @type {import('i18next-parser').UserConfig} */
export default {
  locales: ["en", "pt-BR"],
  output: "src/i18n/locales/$LOCALE/$NAMESPACE.json",
  defaultNamespace: "ui",
  keySeparator: false,
  namespaceSeparator: ":",
  lexers: { ts: ["JavascriptLexer"], tsx: ["JsxLexer"] },
  input: ["src/**/*.{ts,tsx}"],
  // DEVIATION from the plan (which specified keepRemoved:false). This codebase
  // resolves MANY keys dynamically — template literals like
  // `middag.ui.form.document.${docType}.any` — and pulls many strings at runtime
  // from host/server catalogs that are NOT bundled here. A static lexer cannot
  // see those, so keepRemoved:false DESTROYS the catalogs: a dry-run cut
  // en/ui.json 226 -> 105 keys and blanked 33 pt-BR translations. keepRemoved:true
  // makes extraction strictly ADDITIVE: it scaffolds entries for newly-found
  // literal t('key') calls but NEVER deletes an existing key or pt-BR value.
  // Treat this script as a helper for new strings, not a source of truth.
  keepRemoved: true,
  createOldCatalogs: false,
  sort: true,
  defaultValue: (locale, _ns, key) => (locale === "en" ? key : ""),
};

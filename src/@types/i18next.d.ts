import "i18next";

declare module "i18next" {
  // Keys are intentionally NOT typed as a literal union. This codebase builds
  // keys dynamically (e.g. `middag.ui.form.document.${docType}.any`) and
  // resolves many strings at runtime from host/server catalogs not bundled
  // here, so a literal-key union from the JSON would reject valid calls. We
  // keep defaultNS + keySeparator and let t() accept any string key.
  interface CustomTypeOptions {
    defaultNS: "ui";
    keySeparator: false;
  }
}

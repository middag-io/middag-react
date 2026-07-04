/** Merge add-on default UI strings into the i18next 'ui' namespace at boot. */
import { i18n, NS, SUPPORTED_LNGS } from "./instance";

export function registerUiStrings(
  byLocale: Partial<Record<(typeof SUPPORTED_LNGS)[number], Record<string, string>>>,
): void {
  for (const [lng, strings] of Object.entries(byLocale)) {
    if (strings) i18n.addResourceBundle(lng, NS.ui, strings, true, true);
  }
}

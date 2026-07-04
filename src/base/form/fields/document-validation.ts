/**
 * Document validation — country-aware tax/identity document validation.
 *
 * Uses validator.js isTaxID for checksum validation across 30+ countries.
 * Supports scope restriction: "person" (individual), "company" (business), or "any" (both).
 *
 * Example: locale "pt-BR" with scope "person" validates CPF only (rejects CNPJ).
 */

import isTaxID from "validator/lib/isTaxID";

/**
 * Document type: a validator.js locale string ("pt-BR", "en-US", etc.),
 * "generic" (accepts anything), or a custom key matching a documentMasks entry.
 */
export type DocumentType = string;

export type DocumentScope = "person" | "company" | "any";

/**
 * All locales supported by validator.js isTaxID.
 */
export const SUPPORTED_LOCALES = [
  "bg-BG",
  "cs-CZ",
  "de-AT",
  "de-DE",
  "dk-DK",
  "el-CY",
  "el-GR",
  "en-CA",
  "en-GB",
  "en-IE",
  "en-US",
  "es-AR",
  "es-ES",
  "et-EE",
  "fi-FI",
  "fr-BE",
  "fr-CA",
  "fr-FR",
  "fr-LU",
  "hr-HR",
  "hu-HU",
  "it-IT",
  "lb-LU",
  "lt-LT",
  "lv-LV",
  "mt-MT",
  "nl-BE",
  "nl-NL",
  "pl-PL",
  "pt-BR",
  "pt-PT",
  "ro-RO",
  "sk-SK",
  "sl-SI",
  "sv-SE",
  "uk-UA",
] as const;

export type TaxIDLocale = (typeof SUPPORTED_LOCALES)[number];

/** Strip non-alphanumeric characters from a value. */
function stripFormatting(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, "");
}

/**
 * Digit-length rules for scope enforcement.
 * When a locale has distinct person/company document lengths,
 * we check the stripped length to enforce scope.
 */
const SCOPE_LENGTH_RULES: Record<string, { person?: number[]; company?: number[] }> = {
  "pt-BR": { person: [11], company: [14] }, // CPF=11, CNPJ=14
  "en-US": { person: [9], company: [9] }, // SSN=9, EIN=9 (same length, different format)
  "it-IT": { person: [16], company: [11] }, // CF=16 alphanum, P.IVA=11
  "fr-FR": { person: [13], company: [9, 14] }, // SPI=13, SIREN=9, SIRET=14
  "pl-PL": { person: [11], company: [10] }, // PESEL=11, NIP=10
  "nl-NL": { person: [9], company: [8] }, // BSN=9, KVK=8
  "ro-RO": { person: [13], company: [2, 3, 4, 5, 6, 7, 8, 9, 10] }, // CNP=13, CUI=2-10
  "fi-FI": { person: [11], company: [9] }, // HETU=11 with dash, Y-tunnus=9
};

/**
 * Validate a document/tax ID value with optional scope restriction.
 *
 * @param value - The document value (can be formatted with masks).
 * @param type - A validator.js locale ("pt-BR", "en-US", etc.),
 *               "generic" (accepts anything), or a custom key.
 * @param scope - Restrict to "person", "company", or "any" (default).
 */
export function isValidDocument(
  value: string,
  type: DocumentType,
  scope: DocumentScope = "any",
): boolean {
  if (!value || type === "generic") return true;

  const stripped = stripFormatting(value);
  if (stripped.length === 0) return true;

  // If it matches a validator.js locale pattern (xx-XX), use isTaxID
  if (/^[a-z]{2}-[A-Z]{2}$/.test(type)) {
    // First validate with isTaxID (checksum)
    if (!isTaxID(stripped, type as Parameters<typeof isTaxID>[1])) {
      return false;
    }

    // Then enforce scope if rules exist for this locale
    if (scope !== "any") {
      const rules = SCOPE_LENGTH_RULES[type];
      if (rules) {
        const allowedLengths = scope === "person" ? rules.person : rules.company;
        if (allowedLengths && !allowedLengths.includes(stripped.length)) {
          return false;
        }
      }
    }

    return true;
  }

  // Custom type — no built-in validation, accept anything non-empty
  return stripped.length > 0;
}

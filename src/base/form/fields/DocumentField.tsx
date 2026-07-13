/**
 * DocumentField — masked input for identity/tax documents.
 *
 * Validation: validator.js isTaxID with 30+ country locales.
 * The host sends:
 *   - `documentType`: locale string ("pt-BR", "en-US", "de-DE")
 *   - `documentScope`: "person", "company", or "any" (default)
 *
 * Examples:
 *   documentType: "pt-BR", documentScope: "person"   → CPF only
 *   documentType: "pt-BR", documentScope: "company"  → CNPJ only
 *   documentType: "pt-BR"                            → CPF or CNPJ
 *   documentType: "en-US", documentScope: "company"  → EIN only
 */

import { useCallback, useMemo, type ReactElement } from "react";

import { useTranslation } from "@/i18n/useTranslation";
import { Input } from "@/primitives/reui/input";

export type { DocumentType } from "./document-validation";
// eslint-disable-next-line react-refresh/only-export-components
export { isValidDocument } from "./document-validation";

interface MaskDef {
  pattern: string;
  maxLength: number;
}

interface ScopedMasks {
  person?: MaskDef;
  company?: MaskDef;
  any: MaskDef;
}

/**
 * Built-in mask definitions per locale, scoped by person/company/any.
 * Only locales with distinct person/company formats need all three.
 */
const LOCALE_MASKS: Record<string, ScopedMasks> = {
  "pt-BR": {
    person: { pattern: "###.###.###-##", maxLength: 14 },
    company: { pattern: "##.###.###/####-##", maxLength: 18 },
    any: { pattern: "###.###.###-##", maxLength: 18 },
  },
  "en-US": {
    person: { pattern: "###-##-####", maxLength: 11 },
    company: { pattern: "##-#######", maxLength: 10 },
    any: { pattern: "", maxLength: 11 },
  },
  "es-AR": {
    person: { pattern: "##-########-#", maxLength: 13 },
    company: { pattern: "##-########-#", maxLength: 13 },
    any: { pattern: "##-########-#", maxLength: 13 },
  },
  "es-ES": {
    person: { pattern: "#########", maxLength: 10 },
    company: { pattern: "#########", maxLength: 10 },
    any: { pattern: "#########", maxLength: 10 },
  },
  "it-IT": {
    person: { pattern: "################", maxLength: 16 },
    company: { pattern: "###########", maxLength: 11 },
    any: { pattern: "################", maxLength: 16 },
  },
  "fr-FR": {
    person: { pattern: "# ## ### ### ###", maxLength: 16 },
    company: { pattern: "#########", maxLength: 9 },
    any: { pattern: "# ## ### ### ###", maxLength: 16 },
  },
  "nl-NL": {
    person: { pattern: "#########", maxLength: 9 },
    company: { pattern: "########", maxLength: 8 },
    any: { pattern: "#########", maxLength: 9 },
  },
  "en-GB": {
    any: { pattern: "", maxLength: 12 },
  },
  "pt-PT": {
    any: { pattern: "#########", maxLength: 9 },
  },
  "de-DE": {
    any: { pattern: "###########", maxLength: 11 },
  },
  "de-AT": {
    any: { pattern: "#########", maxLength: 9 },
  },
  "pl-PL": {
    person: { pattern: "###########", maxLength: 11 },
    company: { pattern: "##########", maxLength: 10 },
    any: { pattern: "###########", maxLength: 11 },
  },
  "sv-SE": {
    person: { pattern: "######-####", maxLength: 11 },
    company: { pattern: "######-####", maxLength: 11 },
    any: { pattern: "######-####", maxLength: 11 },
  },
  "ro-RO": {
    person: { pattern: "#############", maxLength: 13 },
    company: { pattern: "##########", maxLength: 10 },
    any: { pattern: "#############", maxLength: 13 },
  },
  "fi-FI": {
    person: { pattern: "######-####", maxLength: 11 },
    company: { pattern: "#######-#", maxLength: 9 },
    any: { pattern: "######-####", maxLength: 11 },
  },
};

const FALLBACK_MASK: MaskDef = { pattern: "", maxLength: 30 };

/** Apply mask pattern to raw input. '#' = digit placeholder. */
function applyMask(raw: string, pattern: string): string {
  if (!pattern) return raw;
  const digits = raw.replace(/\D/g, "");
  let result = "";
  let dIdx = 0;
  for (let i = 0; i < pattern.length && dIdx < digits.length; i++) {
    if (pattern[i] === "#") {
      result += digits[dIdx++];
    } else {
      result += pattern[i];
    }
  }
  return result;
}

/** Resolve the correct mask for a locale + scope combination. */
function resolveMask(
  locale: string,
  scope: "person" | "company" | "any",
  customMasks?: Record<string, MaskDef>,
): MaskDef {
  // Custom masks take priority (keyed by locale or locale.scope)
  if (customMasks) {
    const scopedKey = `${locale}.${scope}`;
    if (customMasks[scopedKey]) return customMasks[scopedKey];
    if (customMasks[locale]) return customMasks[locale];
  }

  const localeMasks = LOCALE_MASKS[locale];
  if (!localeMasks) return FALLBACK_MASK;

  if (scope === "person" && localeMasks.person) return localeMasks.person;
  if (scope === "company" && localeMasks.company) return localeMasks.company;
  return localeMasks.any;
}

export interface DocumentFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  documentType?: string;
  documentScope?: "person" | "company" | "any";
  documentMasks?: Record<string, MaskDef>;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpTextId?: string;
  errorId?: string;
}

export function DocumentField({
  id,
  value,
  onChange,
  documentType = "generic",
  documentScope = "any",
  documentMasks,
  placeholder,
  disabled,
  required,
  error,
  helpTextId,
  errorId,
}: DocumentFieldProps): ReactElement {
  const { t } = useTranslation();

  const mask = useMemo(
    () => resolveMask(documentType, documentScope, documentMasks),
    [documentType, documentScope, documentMasks],
  );

  const describedBy =
    [error ? errorId : undefined, helpTextId].filter(Boolean).join(" ") || undefined;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      if (mask.pattern) {
        onChange(applyMask(raw, mask.pattern));
      } else {
        onChange(raw);
      }
    },
    [onChange, mask.pattern],
  );

  // Resolve placeholder: explicit prop > i18n scoped key > i18n locale key > generic fallback
  const resolvedPlaceholder =
    placeholder ??
    t(`middag.ui.form.document.${documentType}.${documentScope}`) ??
    t(`middag.ui.form.document.${documentType}`) ??
    t("middag.ui.form.document_placeholder");

  return (
    <Input
      id={id}
      type="text"
      inputMode="numeric"
      value={value ?? ""}
      onChange={handleChange}
      placeholder={resolvedPlaceholder}
      disabled={disabled}
      maxLength={mask.maxLength}
      aria-invalid={error ? true : undefined}
      aria-required={required || undefined}
      aria-describedby={describedBy}
    />
  );
}

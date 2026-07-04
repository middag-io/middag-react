/**
 * form-schema-builder — generates a Zod validation schema from a FormSchemaNode tree.
 *
 * Walks the server-sent schema, extracts visible fields, and builds Zod validators
 * from field type + validation props. Used by FormPanelBlock with zodResolver for
 * react-hook-form client-side validation.
 *
 * The same form is always re-validated server-side via Inertia — this is an additive
 * UX improvement, not a replacement for server validation.
 */

import type { TFunction } from "i18next";
import { z, type ZodTypeAny } from "zod";

import type { DocumentScope, DocumentType } from "@/base/form/fields/document-validation";
import { extractFields, isFieldRequired, isFieldVisible } from "@/base/form/form-utils";
import type { FormFieldNode, FormSchemaNode } from "@/contracts/block-data";

type TranslateFn = TFunction;

/**
 * Build a Zod validator for a single form field based on its type and props.
 *
 * `required` is the effective required state already resolved by the caller
 * (static `required` prop OR a matching `required_when` condition), not the raw
 * `props.required`.
 */
function buildFieldSchema(
  field: Exclude<FormFieldNode, import("@/contracts/block-data").HeaderFormField>,
  t: TranslateFn,
  required: boolean,
): ZodTypeAny {
  const { component, props } = field;
  const v = props.validation;
  const req = required;

  switch (component) {
    case "text":
    case "textarea":
    case "password":
    case "slug":
    case "color": {
      let s = z.string();
      if (req) s = s.min(1, t("middag.ui.validation.required"));
      if (v?.minLength)
        s = s.min(v.minLength, t("middag.ui.validation.min_length", { min: v.minLength }));
      if (v?.maxLength)
        s = s.max(v.maxLength, t("middag.ui.validation.max_length", { max: v.maxLength }));
      if (v?.pattern)
        s = s.regex(new RegExp(v.pattern), v.patternMessage ?? t("middag.ui.validation.pattern"));
      return req ? s : s.or(z.literal(""));
    }

    case "email": {
      let s = z.string();
      if (req) {
        s = s.min(1, t("middag.ui.validation.required")).email(t("middag.ui.validation.email"));
      } else {
        return s.email(t("middag.ui.validation.email")).or(z.literal(""));
      }
      return s;
    }

    case "url": {
      let s = z.string();
      if (req) {
        s = s.min(1, t("middag.ui.validation.required")).url(t("middag.ui.validation.url"));
      } else {
        return s.url(t("middag.ui.validation.url")).or(z.literal(""));
      }
      return s;
    }

    case "int": {
      let n = z
        .number({ message: t("middag.ui.validation.integer") })
        .int(t("middag.ui.validation.integer"));
      if (props.min != null)
        n = n.min(props.min, t("middag.ui.validation.min_value", { min: props.min }));
      if (props.max != null)
        n = n.max(props.max, t("middag.ui.validation.max_value", { max: props.max }));
      return req ? n : n.nullable();
    }

    case "float": {
      let n = z.number();
      if (props.min != null)
        n = n.min(props.min, t("middag.ui.validation.min_value", { min: props.min }));
      if (props.max != null)
        n = n.max(props.max, t("middag.ui.validation.max_value", { max: props.max }));
      return req ? n : n.nullable();
    }

    case "currency": {
      const n = z.number();
      return req ? n : n.nullable();
    }

    case "select":
    case "radio":
    case "entity_picker": {
      const s = z.string();
      return req ? s.min(1, t("middag.ui.validation.required")) : s;
    }

    case "multiselect":
    case "tags": {
      const a = z.array(z.string());
      return req ? a.min(1, t("middag.ui.validation.required")) : a;
    }

    case "checkbox":
    case "switch":
      return z.boolean();

    case "date":
    case "datetime": {
      const s = z.string();
      return req ? s.min(1, t("middag.ui.validation.required")) : s;
    }

    case "phone": {
      const s = z.string();
      if (req) return s.min(1, t("middag.ui.validation.required"));
      return s;
    }

    case "document": {
      const docType = (props.documentType ?? "generic") as DocumentType;
      const docScope = (props.documentScope ?? "any") as DocumentScope;
      const s = z.string();
      // Validate lazily: the validator.js-backed checksum module (~28 KB) is
      // dynamically imported only when a document field is actually validated,
      // so it never enters the FormPanelBlock chunk for document-less forms.
      // The async refine is fine — zodResolver runs in async mode by default.
      const isValid = async (val: string) => {
        const { isValidDocument } = await import("@/base/form/fields/document-validation");
        return isValidDocument(val, docType, docScope);
      };
      if (req) {
        return s
          .min(1, t("middag.ui.validation.required"))
          .refine(isValid, t("middag.ui.validation.document_invalid"));
      }
      return s.refine(
        async (val) => val === "" || (await isValid(val)),
        t("middag.ui.validation.document_invalid"),
      );
    }

    // file, hidden, static, header, duration — no client validation
    default:
      return z.any();
  }
}

/**
 * Build a complete Zod schema from a FormSchemaNode tree.
 *
 * Only visible fields are included in the schema — hidden fields are not validated.
 * Call this function whenever form values change to rebuild the schema with updated
 * visibility conditions.
 *
 * @param schema - The server-sent form schema tree
 * @param values - Current form values (used for conditional visibility evaluation)
 * @param t - Translation function for error messages
 */
export function buildFormSchema(
  schema: FormSchemaNode[],
  values: Record<string, unknown>,
  t: TranslateFn,
): z.ZodObject<Record<string, ZodTypeAny>> {
  const allFields = extractFields(schema);
  const shape: Record<string, ZodTypeAny> = {};

  for (const field of allFields) {
    // Skip non-interactive and hidden fields
    if (
      field.component === "header" ||
      field.component === "hidden" ||
      field.component === "static"
    ) {
      continue;
    }
    if (!isFieldVisible(field, values)) {
      continue;
    }
    shape[field.key] = buildFieldSchema(field, t, isFieldRequired(field, values));
  }

  return z.object(shape);
}

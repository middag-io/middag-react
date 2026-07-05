/**
 * Form panel types — schema-driven form field definitions.
 *
 * The form field union, the field-props hierarchy and the schema-node wrappers
 * (field, section, group, header) are GENERATED from middag-php-ui — the
 * canonical wire contract (PHP value objects → JSON Schema → these types). This
 * module re-exports them under the stable public names and derives the
 * per-component variant aliases via `Extract`.
 *
 * Only the FormPanelBlockData envelope and the client error shapes stay
 * hand-authored: the rich client `FieldError` ({message, key, domain, params})
 * is intentionally NOT on the wire yet, so it is not generated.
 */

import type { FormComponent, FormFieldNode, FormSchemaNode } from "@/contracts/generated";

// ── Generated contract types (re-exported under the stable public names) ──────

export type {
  FieldPropsBase,
  FormFieldNode,
  FormGroupNode,
  FormHeaderNode,
  FormSchemaNode,
  FormSectionNode,
  OptionFieldProps,
} from "@/contracts/generated";

/** The full catalog of renderable form field components. */
export type FormFieldType = FormComponent;

// ── Field node variants (narrowed from the generated `component` union) ───────
//
// The per-variant interfaces stay part of the public API as `Extract`
// aliases over the generated union, so consumers importing them keep compiling.
// Each constraint matches exactly one generated branch's `component` literals.

/** Simple text-based fields: text, email, url, password, color. */
export type SimpleFormField = Extract<
  FormFieldNode,
  { component: "text" | "email" | "url" | "password" | "color" }
>;

/** Textarea field with configurable row count. */
export type TextareaFormField = Extract<FormFieldNode, { component: "textarea" }>;

/** One-time-password / verification code input (segmented slots). */
export type OtpFormField = Extract<FormFieldNode, { component: "otp" }>;

/** Numeric input fields: int, float. */
export type NumericFormField = Extract<FormFieldNode, { component: "int" | "float" }>;

/** Numeric range slider (single value or multi-thumb range). */
export type SliderFormField = Extract<FormFieldNode, { component: "slider" }>;

/** Fields that select from a list of options: select, radio. */
export type SelectFormField = Extract<FormFieldNode, { component: "select" | "radio" }>;

/** Multi-select field. */
export type MultiSelectFormField = Extract<FormFieldNode, { component: "multiselect" }>;

/** Native HTML <select> — fallback for iframe/portal-hostile contexts (e.g. Moodle). */
export type NativeSelectFormField = Extract<FormFieldNode, { component: "native_select" }>;

/** Boolean toggle fields: checkbox, switch. */
export type BooleanFormField = Extract<FormFieldNode, { component: "checkbox" | "switch" }>;

/** Date and datetime pickers. */
export type DateFormField = Extract<FormFieldNode, { component: "date" | "datetime" }>;

/** Duration input. */
export type DurationFormField = Extract<FormFieldNode, { component: "duration" }>;

/** File upload field with drag-drop support. */
export type FileFormField = Extract<FormFieldNode, { component: "file" }>;

/** Async entity picker with search autocomplete. */
export type EntityPickerFormField = Extract<FormFieldNode, { component: "entity_picker" }>;

/** International phone number input. */
export type PhoneFormField = Extract<FormFieldNode, { component: "phone" }>;

/** National document field (CPF, CNPJ, SSN, etc.) with locale-aware validation. */
export type DocumentFormField = Extract<FormFieldNode, { component: "document" }>;

/** Currency input with locale formatting. */
export type CurrencyFormField = Extract<FormFieldNode, { component: "currency" }>;

/** Auto-generated slug from another field. */
export type SlugFormField = Extract<FormFieldNode, { component: "slug" }>;

/** Tag input with optional max limit. */
export type TagsFormField = Extract<FormFieldNode, { component: "tags" }>;

/** Star rating input. */
export type RatingFormField = Extract<FormFieldNode, { component: "rating" }>;

/** Date range selector with filter operators and presets. */
export type DateRangeFormField = Extract<FormFieldNode, { component: "date_range" }>;

/** Hidden field — not rendered, carries data. */
export type HiddenFormField = Extract<FormFieldNode, { component: "hidden" }>;

/** Static display-only field. */
export type StaticFormField = Extract<FormFieldNode, { component: "static" }>;

/** Visual header separator (non-interactive). */
export type HeaderFormField = Extract<FormFieldNode, { component: "header" }>;

// ── Form panel block data ─────────────────────────────────────────────────────

/**
 * A single server validation error. v0.11.0 wire shape: `message` is the
 * server-resolved (default-locale) string; key/domain/params are the machine
 * channel for client-side re-translation.
 *
 * Hand-authored on purpose: the wire `FieldError` ($def in middag-php-ui) is the
 * leaner `string | string[]`; unifying the two is a deferred breaking change.
 */
export interface FieldError {
  message: string;
  key: string;
  domain: string;
  params?: Record<string, unknown>;
}

export type FormErrorValue = FieldError | FieldError[] | string;

/** Server validation errors keyed by field key. */
export type FormErrors = Record<string, FormErrorValue>;

/** HTTP method the form submits with. */
export type FormMethod = "post" | "put" | "patch";

/** Client/server validation strategy for the form panel. */
export type FormValidationMode = "client" | "server" | "both";

/**
 * FormPanelBlockData — schema-driven form block payload.
 *
 * The backend sends a form schema (FormSchemaNode tree), initial values, server
 * errors and submission metadata. FormPanelBlock renders the schema via FormField,
 * validates client-side (Zod, additive to server validation) and submits via Inertia.
 */
export interface FormPanelBlockData {
  /** Submission endpoint URL. */
  action: string;
  /** HTTP method (post | put | patch). */
  method: FormMethod;
  /** Form schema tree — fields, sections, groups, headers. */
  schema: FormSchemaNode[];
  /** Initial field values, keyed by field key. */
  values: Record<string, unknown>;
  /** Server validation errors, keyed by field key. */
  errors: FormErrors;
  /** Submission UX metadata. */
  meta: {
    submitLabel?: string;
    cancelLabel?: string;
    cancelHref?: string;
    multiStep?: boolean;
    validation?: FormValidationMode;
  };
}

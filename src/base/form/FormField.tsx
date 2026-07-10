/**
 * FormField -- router component that renders the correct input based on field type.
 *
 * Receives a field descriptor and delegates to the matching field component.
 * Wraps each field in a consistent layout: label, help text, input, error message.
 */

import { lazy, Suspense, useId, type ReactElement, type ReactNode } from "react";
import type { TFunction } from "i18next";

import { CheckboxField } from "@/base/form/fields/CheckboxField";
import { ColorField } from "@/base/form/fields/ColorField";
import { CurrencyField } from "@/base/form/fields/CurrencyField";
// DateField, DocumentField, PhoneField are lazy-loaded — see below
import { EntityPickerField } from "@/base/form/fields/EntityPickerField";
import { FileUploadField } from "@/base/form/fields/FileUploadField";
import { MultiSelectField } from "@/base/form/fields/MultiSelectField";
import { NativeSelectField } from "@/base/form/fields/NativeSelectField";
import { NumberFieldComponent } from "@/base/form/fields/NumberField";
import { OtpField } from "@/base/form/fields/OtpField";
import { PasswordField } from "@/base/form/fields/PasswordField";
import { RadioField } from "@/base/form/fields/RadioField";
import { RatingField } from "@/base/form/fields/RatingField";
import { SelectField } from "@/base/form/fields/SelectField";
import { SliderField } from "@/base/form/fields/SliderField";
import { SlugField } from "@/base/form/fields/SlugField";
import { StaticField } from "@/base/form/fields/StaticField";
import { SwitchField } from "@/base/form/fields/SwitchField";
import { TagsField } from "@/base/form/fields/TagsField";
import { TextareaField } from "@/base/form/fields/TextareaField";
import { TextField } from "@/base/form/fields/TextField";
import { isFieldDisabled, isFieldRequired } from "@/base/form/form-utils";
import { useTranslation } from "@/i18n/useTranslation";
import { Label } from "@/primitives/reui/label";
import { Skeleton } from "@/primitives/reui/skeleton";

/** Lazy-loaded PhoneField — libphonenumber-js (~40KB) loads only when a phone field renders. */
const LazyPhoneField = lazy(() =>
  import("@/base/form/fields/PhoneField").then((m) => ({ default: m.PhoneField })),
);

/** Lazy-loaded DateField — date-fns + react-day-picker (~115KB) load only when a date field renders. */
const LazyDateField = lazy(() =>
  import("@/base/form/fields/DateField").then((m) => ({ default: m.DateField })),
);

/** Lazy-loaded DocumentField — validator.js (~28KB) loads only when a document field renders. */
const LazyDocumentField = lazy(() =>
  import("@/base/form/fields/DocumentField").then((m) => ({ default: m.DocumentField })),
);

/** Lazy-loaded DateRangeField — date-fns + ReUI DateSelector loads only when a date_range field renders. */
const LazyDateRangeField = lazy(() =>
  import("@/base/form/fields/DateRangeField").then((m) => ({ default: m.DateRangeField })),
);

function InputSkeleton() {
  return <Skeleton className="h-9 w-full rounded-md" />;
}

export interface FieldOption {
  value: string;
  label: string;
}

/**
 * FieldDescriptor — type alias for the discriminated union FormFieldNode
 * used by FormField component. Narrow by `component` for type-specific props.
 */
export type FieldDescriptor = import("@/contracts/block-data").FormFieldNode;

/**
 * Flattened props union for internal use in renderField().
 * This is the union of ALL possible props across all field variants —
 * used only in the field switch where props are accessed after manual narrowing.
 * Consumer code should use the discriminated union for type-safe narrowing.
 */
type AnyFieldProps = import("@/contracts/block-data").FieldPropsBase &
  Partial<{
    options: Array<{ value: string; label: string }>;
    min: number;
    max: number;
    step: number;
    rows: number;
    accept: string;
    multiple: boolean;
    maxFiles: number;
    maxSize: number;
    documentType: string;
    documentScope: "person" | "company" | "any";
    documentMasks: Record<string, { pattern: string; maxLength: number; placeholder?: string }>;
    defaultCountry: string;
    fixedCountry: boolean;
    currency: string;
    currencyLocale: string;
    autocompleteHref: string;
    autocompleteMinChars: number;
    initialOption: { value: string; label: string; subtitle?: string; avatarUrl?: string };
    entityDisplayField: string;
    entitySubtitleField: string;
    entityAvatarField: string;
    sourceField: string;
    prefix: string;
    maxTags: number;
    maxRating: number;
    operator: string;
    maxLength: number;
    pattern: "digits" | "alphanumeric";
    groupSize: number;
  }>;

export interface FormFieldProps {
  field: FieldDescriptor;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  sourceValues?: Record<string, unknown>;
}

/**
 * Renders a header separator (non-interactive, no label wrapper).
 */
function HeaderField({ label }: { label: string }): ReactElement {
  return (
    <div className="pt-4 pb-1">
      <h4 className="text-foreground text-sm font-semibold">{label}</h4>
    </div>
  );
}

/**
 * Renders the input element for the hidden type.
 */
function HiddenField({ id, value }: { id: string; value: unknown }): ReactElement {
  return <input type="hidden" id={id} value={String(value ?? "")} />;
}

export function FormField({
  field,
  value,
  onChange,
  error,
  sourceValues = {},
}: FormFieldProps): ReactElement {
  const { t } = useTranslation();
  const generatedId = useId();
  const fieldId = `field-${field.key}-${generatedId}`;
  const helpTextId = `${fieldId}-help`;
  const errorId = `${fieldId}-error`;

  const { component, props } = field;

  // Header -- renders just a heading, no label/help/error wrapper.
  if (component === "header") {
    return <HeaderField label={props.label} />;
  }

  // Hidden -- renders a hidden input, no visible wrapper.
  if (component === "hidden") {
    return <HiddenField id={fieldId} value={value} />;
  }

  // Resolve conditional state against the current sibling field values.
  // `sourceValues` carries the full form value map, so disabled_when /
  // required_when can be evaluated here.
  const effectiveDisabled = isFieldDisabled(field, sourceValues);
  const effectiveRequired = isFieldRequired(field, sourceValues);

  // For checkbox and switch, the label is rendered inline by the field itself.
  const isInlineLabel = component === "checkbox" || component === "switch";

  const fieldContent = renderField(
    component,
    fieldId,
    value,
    onChange,
    props as AnyFieldProps,
    error,
    helpTextId,
    errorId,
    t,
    sourceValues,
    effectiveDisabled,
    effectiveRequired,
  );

  return (
    <div className="space-y-1.5">
      {/* Label */}
      {!isInlineLabel && (
        <Label htmlFor={fieldId}>
          {props.label}
          {effectiveRequired && <span className="text-destructive ml-0.5">*</span>}
        </Label>
      )}

      {/* Help text */}
      {props.helpText && (
        <p id={helpTextId} className="text-muted-foreground text-xs">
          {props.helpText}
        </p>
      )}

      {/* Field component */}
      {fieldContent}

      {/* Error message */}
      {error && (
        <p id={errorId} className="text-destructive text-xs" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Switches on component type and renders the correct field component.
 */
function renderField(
  component: string,
  id: string,
  value: unknown,
  onChange: (value: unknown) => void,
  props: AnyFieldProps,
  error: string | undefined,
  helpTextId: string,
  errorId: string,
  _t: TFunction,
  sourceValues: Record<string, unknown>,
  disabled: boolean,
  required: boolean,
): ReactNode {
  const common = {
    id,
    error,
    helpTextId,
    errorId,
    disabled,
    required,
  };

  switch (component) {
    case "text":
      return (
        <TextField
          {...common}
          type="text"
          value={value as string}
          onChange={onChange as (v: string) => void}
          placeholder={props.placeholder}
          readOnly={props.readOnly}
        />
      );

    case "email":
      return (
        <TextField
          {...common}
          type="email"
          value={value as string}
          onChange={onChange as (v: string) => void}
          placeholder={props.placeholder}
          readOnly={props.readOnly}
        />
      );

    case "url":
      return (
        <TextField
          {...common}
          type="url"
          value={value as string}
          onChange={onChange as (v: string) => void}
          placeholder={props.placeholder}
          readOnly={props.readOnly}
        />
      );

    case "textarea":
      return (
        <TextareaField
          {...common}
          value={value as string}
          onChange={onChange as (v: string) => void}
          placeholder={props.placeholder}
          rows={props.rows}
          readOnly={props.readOnly}
        />
      );

    case "password":
      return (
        <PasswordField
          {...common}
          value={value as string}
          onChange={onChange as (v: string) => void}
          placeholder={props.placeholder}
        />
      );

    case "otp":
      return (
        <OtpField
          {...common}
          value={value as string}
          onChange={onChange as (v: string) => void}
          maxLength={props.maxLength}
          pattern={props.pattern}
          groupSize={props.groupSize}
        />
      );

    case "select":
      return (
        <SelectField
          {...common}
          value={value as string}
          onChange={onChange as (v: string) => void}
          options={props.options ?? []}
          placeholder={props.placeholder}
        />
      );

    case "native_select":
      return (
        <NativeSelectField
          {...common}
          value={value as string}
          onChange={onChange as (v: string) => void}
          options={props.options ?? []}
          placeholder={props.placeholder}
        />
      );

    case "multiselect":
      return (
        <MultiSelectField
          {...common}
          value={value as string[]}
          onChange={onChange as (v: string[]) => void}
          options={props.options ?? []}
          placeholder={props.placeholder}
          variant={(props as { variant?: "auto" | "combobox" | "checkbox" }).variant}
        />
      );

    case "radio":
      return (
        <RadioField
          {...common}
          value={value as string}
          onChange={onChange as (v: string) => void}
          options={props.options ?? []}
        />
      );

    case "int":
      return (
        <NumberFieldComponent
          {...common}
          value={value as number | null}
          onChange={onChange as (v: number | null) => void}
          min={props.min}
          max={props.max}
          step={1}
        />
      );

    case "float":
      return (
        <NumberFieldComponent
          {...common}
          value={value as number | null}
          onChange={onChange as (v: number | null) => void}
          min={props.min}
          max={props.max}
          step={props.step ?? 0.1}
        />
      );

    case "slider":
      return (
        <SliderField
          {...common}
          value={value as number | number[] | null}
          onChange={onChange as (v: number | number[]) => void}
          min={props.min}
          max={props.max}
          step={props.step}
          multiple={props.multiple}
        />
      );

    case "checkbox":
      return (
        <CheckboxField
          {...common}
          value={value as boolean}
          onChange={onChange as (v: boolean) => void}
          label={props.label}
        />
      );

    case "switch":
      return (
        <SwitchField
          {...common}
          value={value as boolean}
          onChange={onChange as (v: boolean) => void}
          label={props.label}
        />
      );

    case "date":
      return (
        <Suspense fallback={<InputSkeleton />}>
          <LazyDateField
            {...common}
            mode="date"
            value={value as string}
            onChange={onChange as (v: string) => void}
            placeholder={props.placeholder}
          />
        </Suspense>
      );

    case "datetime":
      return (
        <Suspense fallback={<InputSkeleton />}>
          <LazyDateField
            {...common}
            mode="datetime"
            value={value as string}
            onChange={onChange as (v: string) => void}
            placeholder={props.placeholder}
          />
        </Suspense>
      );

    case "file":
      return (
        <FileUploadField
          {...common}
          value={value}
          onChange={onChange as (v: File[] | File | null) => void}
          accept={props.accept}
          multiple={props.multiple}
          maxFiles={props.maxFiles}
          maxSize={props.maxSize}
        />
      );

    case "entity_picker":
      return (
        <EntityPickerField
          {...common}
          value={value as string}
          onChange={onChange as (v: string) => void}
          options={
            props.options as
              | Array<{ value: string; label: string; subtitle?: string; avatarUrl?: string }>
              | undefined
          }
          autocompleteHref={props.autocompleteHref}
          autocompleteMinChars={props.autocompleteMinChars}
          initialOption={props.initialOption}
          entityAvatarField={props.entityAvatarField}
          entitySubtitleField={props.entitySubtitleField}
          placeholder={props.placeholder}
        />
      );

    case "static":
      return <StaticField id={id} value={value} />;

    case "phone":
      return (
        <Suspense fallback={<InputSkeleton />}>
          <LazyPhoneField
            {...common}
            value={value as string}
            onChange={onChange as (v: string) => void}
            placeholder={props.placeholder}
            defaultCountry={props.defaultCountry}
            fixedCountry={props.fixedCountry}
          />
        </Suspense>
      );

    case "document":
      return (
        <Suspense fallback={<InputSkeleton />}>
          <LazyDocumentField
            {...common}
            value={value as string}
            onChange={onChange as (v: string) => void}
            documentType={props.documentType}
            documentScope={props.documentScope}
            documentMasks={props.documentMasks}
            placeholder={props.placeholder}
          />
        </Suspense>
      );

    case "currency":
      return (
        <CurrencyField
          {...common}
          value={value as number | null}
          onChange={onChange as (v: number | null) => void}
          currency={props.currency}
          placeholder={props.placeholder}
          min={props.min}
          max={props.max}
        />
      );

    case "color":
      return (
        <ColorField
          {...common}
          value={value as string}
          onChange={onChange as (v: string) => void}
          placeholder={props.placeholder}
        />
      );

    case "slug":
      return (
        <SlugField
          {...common}
          value={value as string}
          onChange={onChange as (v: string) => void}
          sourceValue={
            props.sourceField !== undefined
              ? String(sourceValues[props.sourceField] ?? "")
              : undefined
          }
          prefix={props.prefix}
          placeholder={props.placeholder}
        />
      );

    case "tags":
      return (
        <TagsField
          {...common}
          value={value as string[]}
          onChange={onChange as (v: string[]) => void}
          placeholder={props.placeholder}
          maxTags={props.maxTags}
        />
      );

    case "date_range":
      return (
        <Suspense fallback={<InputSkeleton />}>
          <LazyDateRangeField
            {...common}
            value={value}
            onChange={onChange}
            operator={props.operator}
          />
        </Suspense>
      );

    case "rating":
      return (
        <RatingField
          {...common}
          value={value as number | null}
          onChange={onChange as (v: number) => void}
          maxRating={props.maxRating}
        />
      );

    default:
      return <p className="text-destructive text-xs">Unknown field component: {component}</p>;
  }
}

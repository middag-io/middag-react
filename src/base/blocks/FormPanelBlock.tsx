/**
 * FormPanelBlock — schema-driven form rendering with react-hook-form + Zod validation.
 *
 * Receives form schema from server, renders fields via FormField router,
 * validates client-side via Zod (generated from schema), and submits via Inertia.
 *
 * Validation modes (meta.validation):
 *   - 'both' (default): client + server validation
 *   - 'client': client-only (no Inertia error handling)
 *   - 'server': server-only (legacy, no Zod schema)
 *
 * Heavy deps (react-hook-form + zod) are isolated to this module so the engine
 * only loads them when a page actually renders a form_panel — see the lazy
 * wrapper in FormPanelBlock.lazy.tsx, which is what register-defaults registers.
 */

import { useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { FieldValues, Resolver, ResolverOptions } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "@inertiajs/core";

import { buildFormSchema } from "@/base/form/form-schema-builder";
import { extractFields, isFieldRequired, isFieldVisible } from "@/base/form/form-utils";
import { FormField } from "@/base/form/FormField";
import { EmptyPlaceholder } from "@/base/partials/EmptyPlaceholder";
import { FormSection } from "@/base/partials/FormSection";
import { Alert, AlertDescription, AlertTitle } from "@/components/reui/alert";
import { Button } from "@/components/reui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/reui/dialog";
import { Separator } from "@/components/reui/separator";
import type { FormErrors, FormPanelBlockData, FormSchemaNode } from "@/contracts/block-data";
import type { BlockProps } from "@/engine/registries";
import { renderLabel } from "@/i18n/render-label";
import { resolveFieldError } from "@/i18n/resolve-field-error";
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/lib/utils";

/** Dynamic form values — keys are server-defined field keys, values are mixed types. */
type DynamicFormValues = Record<string, unknown>;

function defaultValueForField(
  field: ReturnType<typeof extractFields>[number],
  values: DynamicFormValues,
) {
  const existing = values[field.key];
  if (existing !== undefined && existing !== null) return existing;

  switch (field.component) {
    case "int":
    case "float":
    case "currency":
    case "slider":
    case "rating":
      return null;
    case "checkbox":
    case "switch":
      return false;
    case "multiselect":
    case "tags":
      return [];
    default:
      return "";
  }
}

function fieldValue(field: ReturnType<typeof extractFields>[number], values: DynamicFormValues) {
  if (Object.prototype.hasOwnProperty.call(values, field.key)) {
    return values[field.key];
  }
  return defaultValueForField(field, values);
}

// ── Schema renderer ──────────────────────────────────────────────────────────

function SchemaRenderer({
  nodes,
  values,
  errors,
  onChange,
  sourceValues,
}: {
  nodes: FormSchemaNode[];
  values: Record<string, unknown>;
  errors: Record<string, string>;
  onChange: (key: string, value: unknown) => void;
  sourceValues: Record<string, unknown>;
}): ReactElement {
  return (
    <>
      {nodes.map((node, index) => {
        switch (node.kind) {
          case "field": {
            if (!isFieldVisible(node, values)) return null;
            return (
              <FormField
                key={node.key}
                field={node}
                value={fieldValue(node, values)}
                onChange={(val) => onChange(node.key, val)}
                error={errors[node.key]}
                sourceValues={sourceValues}
              />
            );
          }
          case "section":
            return (
              <FormSection
                key={node.id}
                id={node.id}
                title={node.label}
                defaultCollapsed={node.defaultCollapsed}
                hasErrors={node.children.some((c) => c.kind === "field" && !!errors[c.key])}
                errorCount={
                  node.children.filter((c) => c.kind === "field" && !!errors[c.key]).length
                }
              >
                <SchemaRenderer
                  nodes={node.children}
                  values={values}
                  errors={errors}
                  onChange={onChange}
                  sourceValues={sourceValues}
                />
              </FormSection>
            );
          case "group":
            return (
              <div
                key={node.id}
                className={cn("grid gap-6", node.columns === 2 ? "md:grid-cols-2" : "grid-cols-1")}
              >
                <SchemaRenderer
                  nodes={node.children}
                  values={values}
                  errors={errors}
                  onChange={onChange}
                  sourceValues={sourceValues}
                />
              </div>
            );
          case "header":
            return (
              <div key={`header-${index}`} className="space-y-2">
                <Separator />
                <h4 className="text-foreground text-base font-semibold">{node.label}</h4>
              </div>
            );
          default:
            return null;
        }
      })}
    </>
  );
}

// ── FormPanelBlock ───────────────────────────────────────────────────────────

export function FormPanelBlock({ block }: BlockProps<FormPanelBlockData>): ReactElement {
  const { t } = useTranslation();
  const { data } = block;
  const allFields = useMemo(() => extractFields(data.schema), [data.schema]);
  // Authoritative set of keys that map to a rendered field. Server errors whose
  // key is NOT here (form-level "_", dotted/nested paths, unknown keys) are
  // surfaced in a form-level alert instead of being routed through RHF.
  const fieldKeys = useMemo(() => new Set(allFields.map((f) => f.key)), [allFields]);
  const validationMode = data.meta.validation ?? "both";
  const useClientValidation = validationMode !== "server";

  const defaultValues = useMemo(
    () => Object.fromEntries(allFields.map((f) => [f.key, defaultValueForField(f, data.values)])),
    [allFields, data.values],
  );

  // ── react-hook-form setup ──────────────────────────────────────────────

  // Schema ref holds the latest Zod schema. Updated when field visibility changes.
  // The resolver reads from this ref so it always validates against current state.
  const schemaRef = useRef(
    useClientValidation ? buildFormSchema(data.schema, defaultValues, t) : null,
  );

  const stableResolver: Resolver<DynamicFormValues> | undefined = useMemo(() => {
    if (!useClientValidation) return undefined;
    return async (
      values: DynamicFormValues,
      _context: unknown,
      options: ResolverOptions<FieldValues>,
    ) => {
      if (!schemaRef.current) return { values, errors: {} };
      return zodResolver(schemaRef.current)(values, _context, options);
    };
  }, [useClientValidation]);

  const form = useForm<DynamicFormValues>({
    defaultValues,
    mode: "onTouched",
    resolver: stableResolver,
  });

  const watchedValues = useWatch({ control: form.control });
  const currentValues: DynamicFormValues = (watchedValues as DynamicFormValues) ?? defaultValues;

  // Rebuild Zod schema when the conditional state of any field changes.
  // Visibility (visible_when/hidden_when) and required state (required_when,
  // which is also suppressed by disabled_when) both change the generated schema,
  // so the key must track both — not visibility alone.
  const schemaStateKey = allFields
    .map(
      (f) =>
        `${isFieldVisible(f, currentValues) ? "1" : "0"}${isFieldRequired(f, currentValues) ? "1" : "0"}`,
    )
    .join("");

  useEffect(() => {
    if (useClientValidation) {
      schemaRef.current = buildFormSchema(data.schema, currentValues, t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on schemaStateKey, not currentValues
  }, [useClientValidation, data.schema, t, schemaStateKey]);

  const [showDirtyDialog, setShowDirtyDialog] = useState(false);
  // Upload progress (0-100) while a multipart submit is in flight; null otherwise.
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  // Non-field server errors captured at submit time (Inertia onError). Kept out
  // of RHF so dotted keys are not interpreted as nested paths and lost.
  const [submitFormErrors, setSubmitFormErrors] = useState<FormErrors>({});

  // Reset the form when the server sends new initial values (e.g. an Inertia
  // partial reload that normalizes data). Without this, useForm keeps the
  // mount-time defaults and the UI can submit stale input.
  //
  // Keyed on the serialized values: a new prop object with identical content
  // (common with Inertia) produces the same key and skips the reset, so
  // in-progress edits are not clobbered and no render loop forms. The first
  // run is skipped because useForm already initialized with these defaults.
  // reset() clears the dirty flag, so this never marks the form dirty.
  const initialValuesKey = JSON.stringify(data.values);
  const isFirstValuesSync = useRef(true);
  useEffect(() => {
    if (isFirstValuesSync.current) {
      isFirstValuesSync.current = false;
      return;
    }
    form.reset(defaultValues);
    // reset() clears errors — re-apply any server errors that survive the reload.
    for (const [field, err] of Object.entries(data.errors)) {
      if (!fieldKeys.has(field)) continue; // non-field/dotted -> formLevelErrors
      form.setError(field, { type: "server", message: resolveFieldError(err, t) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on initialValuesKey only
  }, [initialValuesKey]);

  // Sync server errors into react-hook-form (re-translated client-side).
  const serverErrorRef = JSON.stringify(data.errors);
  useEffect(() => {
    if (Object.keys(data.errors).length > 0) {
      for (const [field, err] of Object.entries(data.errors)) {
        if (!fieldKeys.has(field)) continue; // non-field/dotted -> formLevelErrors
        form.setError(field, { type: "server", message: resolveFieldError(err, t) });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverErrorRef]);

  const { isDirty, isSubmitting } = form.formState;

  // Browser beforeunload warning
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // ── Handlers ───────────────────────────────────────────────────────────

  const handleFieldChange = useCallback(
    (key: string, value: unknown) => {
      form.setValue(key, value, {
        shouldDirty: true,
        shouldValidate: form.formState.isSubmitted,
      });
      form.clearErrors(key);
    },
    [form],
  );

  const onSubmit = useCallback(
    (payload: DynamicFormValues) => {
      // Clear stale form-level errors from a previous attempt.
      setSubmitFormErrors({});

      // Filter to visible fields only
      const visibleFields = allFields.filter((f) => isFieldVisible(f, payload));
      const visiblePayload = Object.fromEntries(visibleFields.map((f) => [f.key, payload[f.key]]));

      // Force multipart encoding when any value is a File so Inertia streams
      // the upload (and onProgress reports real bytes-sent percentages).
      const hasFile = Object.values(visiblePayload).some(
        (v) => v instanceof File || (Array.isArray(v) && v.some((item) => item instanceof File)),
      );

      const method = data.method === "put" ? "put" : data.method === "patch" ? "patch" : "post";
      router[method](data.action, visiblePayload as Record<string, string>, {
        forceFormData: hasFile,
        onProgress: (event) => {
          if (event && typeof event.percentage === "number") {
            setUploadProgress(Math.round(event.percentage));
          }
        },
        onError: (errors) => {
          // Inertia types page-prop errors as flat strings, but v0.11.0 sends
          // structured FieldError objects on the wire — cast through unknown.
          const nonField: FormErrors = {};
          for (const [field, err] of Object.entries(errors as unknown as FormErrors)) {
            if (fieldKeys.has(field)) {
              form.setError(field, { type: "server", message: resolveFieldError(err, t) });
            } else {
              // Form-level / dotted / unknown keys: surface via the alert, not RHF.
              nonField[field] = err;
            }
          }
          if (Object.keys(nonField).length > 0) {
            setSubmitFormErrors((prev) => ({ ...prev, ...nonField }));
          }
        },
        onFinish: () => setUploadProgress(null),
      });
    },
    [allFields, data, form, t, fieldKeys],
  );

  const handleCancel = useCallback(() => {
    if (isDirty) {
      setShowDirtyDialog(true);
    } else if (data.meta.cancelHref) {
      router.visit(data.meta.cancelHref);
    } else {
      window.history.back();
    }
  }, [isDirty, data.meta.cancelHref]);

  // Derive errors from react-hook-form state for SchemaRenderer
  const displayErrors = useMemo(() => {
    const errors: Record<string, string> = {};
    for (const [key, err] of Object.entries(form.formState.errors)) {
      if (err?.message) errors[key] = err.message as string;
    }
    return errors;
  }, [form.formState.errors]);

  // Form-level errors: any server error whose key is not a rendered field key
  // (the PHP "_" orphan key, dotted/nested paths, or unknown keys). Derived
  // straight from the wire prop + submit-time errors and deduped by key, so
  // dotted keys survive intact (never routed through RHF path interpretation).
  const formLevelErrors = useMemo(() => {
    const byKey = new Map<string, string>();
    const collect = (src: FormErrors) => {
      for (const [key, err] of Object.entries(src)) {
        if (fieldKeys.has(key)) continue;
        const message = resolveFieldError(err, t);
        if (message) byKey.set(key, message);
      }
    };
    collect(data.errors);
    collect(submitFormErrors);
    return Array.from(byKey, ([key, message]) => ({ key, message }));
  }, [data.errors, submitFormErrors, fieldKeys, t]);

  // No visible fields
  const visibleFields = allFields.filter((f) => isFieldVisible(f, currentValues));
  if (visibleFields.length === 0 && data.schema.length === 0) {
    return <EmptyPlaceholder variant="inline" title={t("middag.ui.form.no_fields")} />;
  }

  return (
    <>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto max-w-[720px] space-y-6"
        noValidate
        role="form"
        aria-label={renderLabel(block.title, t) || t("middag.ui.form.default_title")}
      >
        {/* Form-level / non-field server errors (keys with no matching field) */}
        {formLevelErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertTitle>{t("middag.ui.form.errors_title")}</AlertTitle>
            <AlertDescription>
              <ul className="list-disc ps-4">
                {formLevelErrors.map((e) => (
                  <li key={e.key}>{e.message}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <SchemaRenderer
          nodes={data.schema}
          values={currentValues}
          errors={displayErrors}
          onChange={handleFieldChange}
          sourceValues={currentValues}
        />

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            aria-disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting
              ? uploadProgress !== null
                ? `${t("middag.ui.form.saving")} ${uploadProgress}%`
                : t("middag.ui.form.saving")
              : (data.meta.submitLabel ?? t("middag.ui.form.save"))}
          </Button>
          <Button type="button" variant="outline" onClick={handleCancel}>
            {data.meta.cancelLabel ?? t("middag.ui.cancel")}
          </Button>
        </div>
      </form>

      {/* Dirty navigation dialog */}
      <Dialog open={showDirtyDialog} onOpenChange={setShowDirtyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("middag.ui.form.dirty_title")}</DialogTitle>
            <DialogDescription>{t("middag.ui.form.dirty_message")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDirtyDialog(false)}>
              {t("middag.ui.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowDirtyDialog(false);
                if (data.meta.cancelHref) {
                  router.visit(data.meta.cancelHref);
                } else {
                  window.history.back();
                }
              }}
            >
              {t("middag.ui.form.dirty_leave")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

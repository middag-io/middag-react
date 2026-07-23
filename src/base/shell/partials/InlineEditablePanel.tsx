"use client";

import { useMemo, useState, type ReactElement, type ReactNode } from "react";

import { buildFormSchema } from "@/base/form/form-schema-builder";
import { isFieldVisible } from "@/base/form/form-utils";
import { FormField } from "@/base/form/FormField";
import type { FormFieldNode, FormSchemaNode } from "@/contracts/block-data";
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/lib/utils";
import { Button } from "@/primitives/reui/button";

import { useEditablePanel } from "./EditablePanelContext";

type Values = Record<string, unknown>;

function defaultValueFor(node: FormFieldNode): unknown {
  switch (node.component) {
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

function valueOf(node: FormFieldNode, values: Values): unknown {
  if (Object.prototype.hasOwnProperty.call(values, node.key)) return values[node.key];
  return defaultValueFor(node);
}

/** Recursively render the schema tree — fields, sections, groups, headers. */
function renderNodes(
  nodes: FormSchemaNode[],
  values: Values,
  errors: Record<string, string>,
  setValue: (key: string, value: unknown) => void,
): ReactNode {
  return nodes.map((node, index) => {
    switch (node.kind) {
      case "field": {
        if (!isFieldVisible(node, values)) return null;
        return (
          <FormField
            key={node.key}
            field={node}
            value={valueOf(node, values)}
            onChange={(val) => setValue(node.key, val)}
            error={errors[node.key]}
            sourceValues={values}
          />
        );
      }
      case "header":
        return (
          <h4 key={`header-${index}`} className="text-foreground pt-2 text-sm font-semibold">
            {node.label}
          </h4>
        );
      case "section":
        return (
          <section key={node.id} className="space-y-3">
            <div className="text-muted-foreground text-[11px] font-medium tracking-[0.04em] uppercase">
              {node.label}
            </div>
            {renderNodes(node.children, values, errors, setValue)}
          </section>
        );
      case "group":
        return (
          <div
            key={node.id}
            className={cn(node.columns === 2 ? "grid grid-cols-2 gap-3" : "space-y-3")}
          >
            {renderNodes(node.children, values, errors, setValue)}
          </div>
        );
      default:
        return null;
    }
  });
}

/**
 * InlineEditablePanel — the free editable-panel primitive's renderer. A resizable
 * right-side drawer that renders an EditablePanelDescriptor's form (reusing the
 * FormField router + Zod schema builder), validates on save, and submits via the
 * provider. Renders nothing when the context is disabled or nothing is selected.
 *
 * Reads everything from useEditablePanel(); the free EditablePanelProvider fills
 * the context. Mount once inside the shell (a fixed overlay, so it does not need
 * to sit in any particular flex slot).
 */
export function InlineEditablePanel(): ReactElement | null {
  const { t } = useTranslation();
  const { enabled, selectedId, descriptor, loading, saving, submit, close, width } =
    useEditablePanel();

  const [values, setValues] = useState<Values>(() =>
    descriptor?.values ? { ...descriptor.values } : {},
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Re-seed the form whenever a new descriptor arrives (new selection). Done as
  // the "adjust state when a prop changes" render-time pattern (guarded by the
  // previous descriptor stored in state) rather than an effect, so no cascading
  // render / set-state-in-effect.
  const [seededFrom, setSeededFrom] = useState(descriptor);
  if (descriptor !== seededFrom) {
    setSeededFrom(descriptor);
    setValues(descriptor?.values ? { ...descriptor.values } : {});
    setErrors({});
  }

  const [resizeWidth, setResizeWidth] = useState<number | null>(null);
  const effectiveWidth = resizeWidth ?? width;

  const setValue = useMemo(
    () => (key: string, value: unknown) => {
      setValues((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [],
  );

  if (!enabled || selectedId === null) return null;

  const onResizeDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = effectiveWidth;
    const move = (ev: PointerEvent) => {
      setResizeWidth(Math.min(720, Math.max(320, startW + (startX - ev.clientX))));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const onSave = () => {
    if (!descriptor) return;
    const zschema = buildFormSchema(descriptor.schema, values, t);
    const result = zschema.safeParse(values);
    if (!result.success) {
      const next: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? "");
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    submit(result.data as Values);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={close} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        className="bg-background fixed top-0 right-0 bottom-0 z-50 flex flex-col overflow-hidden border-l shadow-2xl"
        style={{ width: effectiveWidth }}
      >
        <div
          onPointerDown={onResizeDown}
          className="hover:bg-primary/30 absolute top-0 bottom-0 left-0 z-10 w-1.5 cursor-col-resize"
          aria-hidden
        />

        {/* Header */}
        <div className="border-border/60 flex items-start gap-2 border-b px-4 pt-3 pb-2.5">
          <div className="min-w-0 flex-1">
            {descriptor?.subtitle && (
              <div className="text-muted-foreground mb-0.5 font-mono text-[11px] font-semibold tracking-wide uppercase">
                {descriptor.subtitle}
              </div>
            )}
            <h3 className="text-foreground truncate text-base leading-snug font-semibold">
              {descriptor?.title ?? t("middag.ui.loading")}
            </h3>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label={t("middag.ui.editable_panel.close")}
            className="text-muted-foreground hover:text-foreground hover:bg-muted rounded p-1 transition-colors"
          >
            <span aria-hidden className="text-sm leading-none">
              ✕
            </span>
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {loading || !descriptor ? (
            <div className="flex items-center justify-center p-8">
              <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
            </div>
          ) : (
            <div className="space-y-3.5">
              {renderNodes(descriptor.schema, values, errors, setValue)}
            </div>
          )}
        </div>

        {/* Footer */}
        {descriptor && !loading && (
          <div className="flex justify-end gap-2 border-t p-3">
            <Button type="button" variant="outline" size="sm" onClick={close} disabled={saving}>
              {descriptor.cancelLabel ?? t("middag.ui.cancel")}
            </Button>
            <Button type="button" size="sm" onClick={onSave} disabled={saving}>
              {descriptor.submitLabel ?? t("middag.ui.form.save")}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

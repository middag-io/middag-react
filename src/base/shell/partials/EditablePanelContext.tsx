"use client";

import { createContext, useContext } from "react";

import type { FormSchemaNode } from "@/contracts/block-data";

// ── Types ────────────────────────────────────────────────────────────────────

/**
 * EditablePanelDescriptor — the form a panel edits. Mirrors the FormPanel block
 * payload (schema + values + submit metadata) so the panel reuses the same
 * FormField router and Zod schema builder the form_panel block uses.
 */
export interface EditablePanelDescriptor {
  title: string;
  /** Small label above the title (e.g. "Formulário · matricula-2026"). */
  subtitle?: string;
  /** Form schema tree — fields, sections, groups, headers (FormPanel shape). */
  schema: FormSchemaNode[];
  /** Initial field values, keyed by field key. */
  values?: Record<string, unknown>;
  /** Save button label; falls back to the engine default. */
  submitLabel?: string;
  /** Cancel button label; falls back to the engine default. */
  cancelLabel?: string;
}

/**
 * EditablePanelConfig — page-level config delivered as a shared prop (like the
 * inspector). Hybrid source (D-02): the descriptor may ship inline OR be fetched
 * from `endpoint` per selected id.
 */
export interface EditablePanelConfig {
  /**
   * GET endpoint returning an EditablePanelDescriptor; `{id}` is interpolated
   * with the opened row id. Omit when `descriptor` is supplied inline.
   */
  endpoint?: string;
  /** Inline descriptor — skips the GET (contract-embedded source). */
  descriptor?: EditablePanelDescriptor;
  /** Save endpoint; `{id}` interpolated. Defaults to `endpoint`. */
  submitEndpoint?: string;
  /** Save HTTP method. Default "post". */
  submitMethod?: "post" | "put" | "patch";
  /** Panel width in px. Default 420. */
  width?: number;
}

export interface EditablePanelContextValue {
  selectedId: string | number | null;
  open: (id: string | number) => void;
  close: () => void;
  enabled: boolean;
  descriptor: EditablePanelDescriptor | null;
  loading: boolean;
  saving: boolean;
  submit: (values: Record<string, unknown>) => void;
  width: number;
}

// ── Context ──────────────────────────────────────────────────────────────────
//
// The Community engine owns the editable-panel CONTEXT and PROVIDER (unlike the
// inspector, whose provider is Pro — D-03: this primitive is fully free). Blocks
// (DenseTable) call useEditablePanel() and degrade gracefully to the disabled
// no-op default when a page ships no `editablePanel` config.

export const EditablePanelContext = createContext<EditablePanelContextValue>({
  selectedId: null,
  open: () => {},
  close: () => {},
  enabled: false,
  descriptor: null,
  loading: false,
  saving: false,
  submit: () => {},
  width: 420,
});

export function useEditablePanel(): EditablePanelContextValue {
  return useContext(EditablePanelContext);
}

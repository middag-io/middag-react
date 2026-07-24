"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { router } from "@inertiajs/core";

import {
  EditablePanelContext,
  type EditablePanelConfig,
  type EditablePanelContextValue,
  type EditablePanelDescriptor,
} from "./EditablePanelContext";

interface EditablePanelProviderProps {
  config: EditablePanelConfig;
  children: ReactNode;
}

/** Interpolate the `{id}` token in an endpoint template. */
function withId(endpoint: string, id: string | number): string {
  return endpoint.replace("{id}", String(id));
}

/**
 * EditablePanelProvider — free provider that fills EditablePanelContext with real
 * data fetching + submission. Mounted by the shell when the page ships an
 * `editablePanel` config. Does NOT render the panel — InlineEditablePanel renders
 * as a flex sibling and reads the same context via useEditablePanel().
 *
 * Source is hybrid (D-02): an inline `descriptor` is used verbatim; otherwise the
 * descriptor is fetched per-id from `endpoint`. Submission goes through the
 * Inertia router (same transport as the form_panel block), so hosts get
 * server-driven refresh + validation errors for free.
 */
export function EditablePanelProvider({ config, children }: EditablePanelProviderProps) {
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [descriptor, setDescriptor] = useState<EditablePanelDescriptor | null>(
    config.descriptor ?? null,
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const open = useCallback(
    (id: string | number) => {
      setSelectedId(id);
      // Inline descriptor (contract-embedded) — no round-trip.
      if (config.descriptor) {
        setDescriptor(config.descriptor);
        return;
      }
      if (config.endpoint) setLoading(true);
    },
    [config.descriptor, config.endpoint],
  );

  const close = useCallback(() => {
    setSelectedId(null);
    if (!config.descriptor) setDescriptor(null);
  }, [config.descriptor]);

  // Fetch the descriptor for the selected id (endpoint source only).
  useEffect(() => {
    if (selectedId === null || config.descriptor || !config.endpoint) return;

    const url = withId(config.endpoint, selectedId);
    let cancelled = false;

    fetch(url, {
      headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" },
    })
      .then((r) => r.json())
      .then((json: EditablePanelDescriptor) => {
        if (!cancelled) setDescriptor(json);
      })
      .catch(() => {
        if (!cancelled) setDescriptor(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedId, config.descriptor, config.endpoint]);

  const submit = useCallback(
    (values: Record<string, unknown>) => {
      if (selectedId === null) return;
      const base = config.submitEndpoint ?? config.endpoint;
      if (!base) return;
      const url = withId(base, selectedId);
      const method = config.submitMethod ?? "post";
      setSaving(true);
      router[method](url, values as Record<string, string>, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => close(),
        onFinish: () => setSaving(false),
      });
    },
    [selectedId, config.submitEndpoint, config.endpoint, config.submitMethod, close],
  );

  const ctx = useMemo<EditablePanelContextValue>(
    () => ({
      selectedId,
      open,
      close,
      enabled: true,
      descriptor,
      loading,
      saving,
      submit,
      width: config.width ?? 420,
    }),
    [selectedId, open, close, descriptor, loading, saving, submit, config.width],
  );

  return <EditablePanelContext.Provider value={ctx}>{children}</EditablePanelContext.Provider>;
}

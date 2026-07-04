/**
 * renderLabel — resolve a contract Label (string | Translatable) to a string.
 *
 * Translatable { key, domain, params } maps to i18next: domain -> namespace,
 * key -> lookup key, params -> single-brace interpolation values. The key is
 * its own defaultValue so a missing translation degrades to the key.
 */
import type { Namespace, TFunction } from "i18next";

import type { Label, Translatable } from "@/contracts/generated";

export type TranslatableLabel = Translatable;
export type RenderableLabel = Label;

export function isTranslatableLabel(label: unknown): label is TranslatableLabel {
  return (
    typeof label === "object" &&
    label !== null &&
    "key" in label &&
    typeof (label as { key: unknown }).key === "string"
  );
}

export function renderLabel(label: RenderableLabel | null | undefined, t: TFunction): string {
  if (label == null) return "";
  if (typeof label === "string") return label;
  return t(label.key, {
    // Host domains are dynamic and not in the static CustomTypeOptions.resources map.
    ns: (label.domain || undefined) as Namespace | undefined,
    defaultValue: label.key,
    ...(label.params ?? {}),
  }) as string;
}

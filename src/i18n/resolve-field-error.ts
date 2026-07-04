/**
 * Resolve a server FieldError to a display string: re-translate key+params
 * client-side (domain -> namespace), falling back to the server-resolved
 * .message when the client catalog lacks the key.
 */
import type { Namespace, TFunction } from "i18next";

import type { FormErrorValue } from "@/contracts/block-data/form";

export function resolveFieldError(error: FormErrorValue, t: TFunction): string {
  if (typeof error === "string") {
    return error;
  }

  if (Array.isArray(error)) {
    return error
      .map((entry) => resolveFieldError(entry, t))
      .filter(Boolean)
      .join(" ");
  }

  return t(error.key, {
    // Validator/host domains are dynamic and not in the static
    // CustomTypeOptions.resources map — cast like render-label / useHostString.
    ns: (error.domain || "validators") as Namespace,
    defaultValue: error.message,
    ...(error.params ?? {}),
  }) as string;
}

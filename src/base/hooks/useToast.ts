/**
 * useToast — typed wrapper around Sonner toast API.
 *
 * Provides a consistent imperative toast interface for block components
 * and system partials. Sonner's Toaster is already mounted in ProductShell.
 *
 * @see Page Builder v2 spec §Gap 4
 */

import { toast as sonnerToast } from "sonner";

export interface ToastData {
  severity: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}

const DEFAULT_DURATION = 5000;

export function useToast() {
  const toast = (data: ToastData) => {
    const duration = data.duration ?? DEFAULT_DURATION;
    sonnerToast[data.severity](data.message, { duration });
  };

  return { toast };
}

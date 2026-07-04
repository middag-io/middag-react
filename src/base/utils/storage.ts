/**
 * Scoped localStorage utilities.
 *
 * All MIDDAG localStorage keys are prefixed with a configurable application key.
 * Default prefix is "middag". Hosts call `setStoragePrefix()` during bootstrap
 * to isolate storage when multiple MIDDAG instances share a domain.
 *
 * @example
 * // Moodle bootstrap:
 * setStoragePrefix("middag-moodle");
 *
 * // WordPress bootstrap:
 * setStoragePrefix("middag-wp");
 *
 * // Result: "middag-moodle-appearance", "middag-wp-appearance"
 */

let prefix = "middag";

/**
 * Set the application-scoped localStorage key prefix.
 * Call once during app bootstrap before any storage reads.
 *
 * When not called, defaults to "middag" for backward compatibility.
 */
export function setStoragePrefix(newPrefix: string): void {
  prefix = newPrefix;
}

/** Get the current storage prefix. */
export function getStoragePrefix(): string {
  return prefix;
}

/** Build a scoped storage key: `{prefix}-{name}`. */
export function storageKey(name: string): string {
  return `${prefix}-${name}`;
}

/** Read a value from scoped localStorage. Returns null if unavailable. */
export function getStorageItem(name: string): string | null {
  try {
    return localStorage.getItem(storageKey(name));
  } catch {
    return null;
  }
}

/** Write a value to scoped localStorage. Silently fails in SSR/incognito. */
export function setStorageItem(name: string, value: string): void {
  try {
    localStorage.setItem(storageKey(name), value);
  } catch {
    /* SSR or storage quota exceeded */
  }
}

/** Remove a value from scoped localStorage. */
export function removeStorageItem(name: string): void {
  try {
    localStorage.removeItem(storageKey(name));
  } catch {
    /* SSR */
  }
}

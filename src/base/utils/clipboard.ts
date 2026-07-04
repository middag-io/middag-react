/**
 * Clipboard utility — safe clipboard write with fallback.
 *
 * @see NV-05-ux-blocks.md §4.4 (copy-to-clipboard in DetailSection)
 */

/**
 * Copy text to clipboard.
 * Returns true on success, false on failure.
 * Falls back to execCommand when Clipboard API is unavailable.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Modern Clipboard API (requires HTTPS or localhost)
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Clipboard API blocked — fall through to fallback
    }
  }

  // Fallback: create temporary textarea and use execCommand
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const success = document.execCommand("copy");
    document.body.removeChild(textarea);
    return success;
  } catch {
    return false;
  }
}

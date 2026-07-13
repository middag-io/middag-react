"use client";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Button } from "@/primitives/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon, CopyIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 1500 });

  return (
    <Button
      variant="outline"
      aria-label={isCopied ? "Copied" : "Copy"}
      onClick={() => copyToClipboard("https://reui.io")}
    >
      {isCopied ? (
        <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} aria-hidden="true" />
      ) : (
        <HugeiconsIcon icon={CopyIcon} strokeWidth={2} aria-hidden="true" />
      )}
      <span>{isCopied ? "Copied" : "Copy"}</span>
    </Button>
  );
}

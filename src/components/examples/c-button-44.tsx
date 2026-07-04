import { useEffect, useState } from "react";

import { Button } from "@/components/reui/button";
import { Spinner } from "@/components/reui/spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons/core-free-icons";

type Status = "idle" | "loading" | "success";

export function Pattern() {
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (status !== "success") return;

    const timer = setTimeout(() => setStatus("idle"), 2000);
    return () => clearTimeout(timer);
  }, [status]);

  return (
    <Button
      onClick={() => {
        if (status !== "idle") return;

        setStatus("loading");
        setTimeout(() => setStatus("success"), 900);
      }}
      disabled={status === "loading"}
      aria-busy={status === "loading"}
      aria-live="polite"
      className="min-w-32"
    >
      {status === "loading" ? (
        <>
          <Spinner aria-hidden="true" />
          Saving…
        </>
      ) : status === "success" ? (
        <>
          <HugeiconsIcon icon={Tick02Icon} strokeWidth={2} aria-hidden="true" />
          Saved
        </>
      ) : (
        "Save changes"
      )}
    </Button>
  );
}

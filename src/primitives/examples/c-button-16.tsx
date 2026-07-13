import { Button } from "@/primitives/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { GithubIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Button variant="secondary">
      <HugeiconsIcon icon={GithubIcon} strokeWidth={2} aria-hidden="true" />
      Github
    </Button>
  );
}

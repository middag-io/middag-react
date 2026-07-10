import { Button } from "@/primitives/reui/button";
import { Kbd, KbdGroup } from "@/primitives/reui/kbd";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Button variant="outline" aria-label="Search (Command K)">
      <HugeiconsIcon icon={Search01Icon} strokeWidth={2} aria-hidden="true" />
      <span>Search</span>
      <KbdGroup aria-hidden="true">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>
    </Button>
  );
}

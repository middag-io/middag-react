import { Badge } from "@/primitives/reui/badge";

import { Button } from "@/primitives/reui/button";

export function Pattern() {
  return (
    <Button aria-label="Updates (new)">
      Updates
      <Badge variant="success" size="xs" aria-hidden="true">
        New
      </Badge>
    </Button>
  );
}

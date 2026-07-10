import { Badge } from "@/primitives/reui/badge";

import { Button } from "@/primitives/reui/button";

export function Pattern() {
  return (
    <Button variant="outline" className="gap-2" aria-label="Messages (12)">
      Messages
      <Badge variant="destructive-outline" size="sm" aria-hidden="true">
        12
      </Badge>
    </Button>
  );
}

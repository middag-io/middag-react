import Link from "next/link";

import { Button } from "@/primitives/reui/button";

export function Pattern() {
  return (
    <Button asChild>
      <Link href="/">Back to Home</Link>
    </Button>
  );
}

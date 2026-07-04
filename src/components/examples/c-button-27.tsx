import Link from "next/link";

import { Button } from "@/components/reui/button";

export function Pattern() {
  return (
    <Button asChild>
      <Link href="/">Back to Home</Link>
    </Button>
  );
}

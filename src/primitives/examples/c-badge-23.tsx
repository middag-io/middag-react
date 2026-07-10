import Link from "next/link";
import { Badge } from "@/primitives/reui/badge";

export function Pattern() {
  return (
    <Badge variant="outline" asChild>
      <Link href="#">Badge</Link>
    </Badge>
  );
}

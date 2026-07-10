import Link from "next/link";
import { Badge } from "@/components/reui/badge";

export function Pattern() {
  return (
    <Badge variant="outline" asChild>
      <Link href="#">Badge</Link>
    </Badge>
  );
}

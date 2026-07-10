import Image from "next/image";
import { Badge } from "@/primitives/reui/badge";

export function Pattern() {
  return (
    <Badge variant="outline">
      <Image
        src="https://flagcdn.com/us.svg"
        alt="US"
        width={18}
        height={18}
        className="rounded-xs"
      />
      USA
    </Badge>
  );
}

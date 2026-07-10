import Image from "next/image";

import { AspectRatio } from "@/primitives/reui/aspect-ratio";

export function Pattern() {
  return (
    <div className="w-full max-w-xs">
      <AspectRatio
        ratio={9 / 16}
        className="bg-muted rounded-4xl overflow-hidden border"
      >
        <Image
          src="https://picsum.photos/1000/800?grayscale&random=5"
          alt="9:16"
          fill
          className="object-cover"
        />
      </AspectRatio>
    </div>
  );
}

import Image from "next/image";

import { AspectRatio } from "@/primitives/reui/aspect-ratio";

export function Pattern() {
  return (
    <div className="w-full max-w-md">
      <AspectRatio
        ratio={21 / 9}
        className="bg-muted rounded-4xl overflow-hidden border"
      >
        <Image
          src="https://picsum.photos/1000/800?grayscale&random=4"
          alt="21:9"
          fill
          className="object-cover"
        />
      </AspectRatio>
    </div>
  );
}

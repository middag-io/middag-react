import Image from "next/image";

import { AspectRatio } from "@/components/reui/aspect-ratio";

export function Pattern() {
  return (
    <div className="w-full max-w-md">
      <AspectRatio
        ratio={3 / 2}
        className="bg-muted rounded-4xl overflow-hidden border"
      >
        <Image
          src="https://picsum.photos/1000/800?grayscale&random=6"
          alt="3:2"
          fill
          className="object-cover"
        />
      </AspectRatio>
    </div>
  );
}

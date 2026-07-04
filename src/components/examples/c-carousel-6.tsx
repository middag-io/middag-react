import Image from "next/image";

import { Card } from "@/components/reui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/reui/carousel";

export function Pattern() {
  return (
    <Carousel
      opts={{
        align: "center",
        loop: true,
      }}
      className="w-full max-w-xs"
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-[70%]">
            <div className="p-1">
              <Card className="relative aspect-video overflow-hidden border-0 p-0">
                <Image
                  src={`https://picsum.photos/800/450?grayscale&random=${index + 30}`}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

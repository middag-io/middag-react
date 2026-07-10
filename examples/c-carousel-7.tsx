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
    <Carousel className="w-full max-w-xs">
      <CarouselContent className="-ml-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/2 pl-1">
            <div className="p-1">
              <Card className="relative aspect-square overflow-hidden border-0 p-0">
                <Image
                  src={`https://picsum.photos/600/600?grayscale&random=${index + 35}`}
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

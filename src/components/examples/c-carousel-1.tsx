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
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="relative aspect-square overflow-hidden border-0 p-0">
                <Image
                  src={`https://picsum.photos/800/800?grayscale&random=${index + 1}`}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:inline-flex" />
      <CarouselNext className="hidden sm:inline-flex" />
    </Carousel>
  );
}

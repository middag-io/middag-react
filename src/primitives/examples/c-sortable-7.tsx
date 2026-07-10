"use client";

import { useState } from "react";
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/primitives/reui/frame";
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from "@/primitives/reui/sortable";
import { HugeiconsIcon } from "@hugeicons/react";
import { DragDropVerticalIcon, ImageIcon } from "@hugeicons/core-free-icons";

interface GalleryImage {
  id: string;
  name: string;
  dimensions: string;
  size: string;
}

const defaultImages: GalleryImage[] = [
  { id: "1", name: "hero-banner.jpg", dimensions: "1920×1080", size: "2.4 MB" },
  { id: "2", name: "product-shot.png", dimensions: "800×600", size: "1.8 MB" },
  { id: "3", name: "team-photo.jpg", dimensions: "1200×800", size: "3.2 MB" },
  { id: "4", name: "logo-dark.svg", dimensions: "240×60", size: "12 KB" },
  { id: "5", name: "og-image.png", dimensions: "1200×630", size: "890 KB" },
  { id: "6", name: "favicon.ico", dimensions: "32×32", size: "4 KB" },
];

export function Pattern() {
  const [images, setImages] = useState<GalleryImage[]>(defaultImages);

  return (
    <div className="mx-auto w-full max-w-md">
      <Frame spacing="xs">
        <FrameHeader>
          <FrameTitle>Media Library</FrameTitle>
          <FrameDescription>Drag to reorder display priority</FrameDescription>
        </FrameHeader>
        <FramePanel className="p-2!">
          <Sortable
            value={images}
            onValueChange={setImages}
            getItemValue={(item) => item.id}
            strategy="grid"
            className="grid grid-cols-3 gap-2"
          >
            {images.map((image) => (
              <SortableItem key={image.id} value={image.id}>
                <div className="bg-muted group rounded-3xl relative flex flex-col items-center justify-center gap-2 border p-4">
                  <SortableItemHandle className="text-muted-foreground hover:text-foreground absolute top-1.5 right-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <HugeiconsIcon
                      icon={DragDropVerticalIcon}
                      strokeWidth={2}
                      className="size-3.5"
                    />
                  </SortableItemHandle>
                  <HugeiconsIcon
                    icon={ImageIcon}
                    strokeWidth={2}
                    className="text-muted-foreground size-5"
                  />
                  <div className="w-full text-center">
                    <p className="truncate text-xs font-medium">{image.name}</p>
                    <p className="text-muted-foreground text-[10px]">
                      {image.dimensions} &middot; {image.size}
                    </p>
                  </div>
                </div>
              </SortableItem>
            ))}
          </Sortable>
        </FramePanel>
      </Frame>
    </div>
  );
}

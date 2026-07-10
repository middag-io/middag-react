import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/primitives/reui/frame";

export function Pattern() {
  return (
    <Frame className="w-full" variant="inverse">
      <FrameHeader>
        <FrameTitle>Inverse</FrameTitle>
      </FrameHeader>
      <FramePanel>
        <p className="text-muted-foreground text-sm">
          Frame and panel background are inversed.
        </p>
      </FramePanel>
    </Frame>
  );
}

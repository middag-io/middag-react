import { Textarea } from "@/primitives/reui/textarea";

export function Pattern() {
  return (
    <div className="mx-auto w-full max-w-xs">
      <Textarea placeholder="Type your message here…" className="w-full" />
    </div>
  );
}

import { Avatar, AvatarFallback, AvatarImage } from "@/primitives/reui/avatar";
import { Button } from "@/primitives/reui/button";

export function Pattern() {
  return (
    <Button>
      <Avatar className="size-5">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CH</AvatarFallback>
      </Avatar>
      <span className="text-xs">@shadcn</span>
    </Button>
  );
}

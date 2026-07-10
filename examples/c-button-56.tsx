import { Avatar, AvatarFallback, AvatarImage } from "@/components/reui/avatar";
import { Button } from "@/components/reui/button";

export function Pattern() {
  return (
    <Button variant="outline">
      <Avatar className="size-5">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CH</AvatarFallback>
      </Avatar>
      <span className="text-xs">@shadcn</span>
    </Button>
  );
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/reui/avatar";

export function Pattern() {
  return (
    <Avatar>
      <AvatarImage
        src="https://github.com/shadcn.png"
        alt="@shadcn"
        className="grayscale"
      />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}

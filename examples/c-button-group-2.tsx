import { Button } from "@/components/reui/button";
import { ButtonGroup } from "@/components/reui/button-group";
import { Input } from "@/components/reui/input";

export function Pattern() {
  return (
    <ButtonGroup>
      <Button variant="outline">Button</Button>
      <Input placeholder="Type something here..." />
    </ButtonGroup>
  );
}

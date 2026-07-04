import { Badge } from "@/components/reui/badge";

import { Button } from "@/components/reui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/reui/item";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  GitBranchIcon,
  FigmaIcon,
  SlackIcon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col">
      <ItemGroup>
        <Item variant="outline" size="xs">
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={GitBranchIcon} strokeWidth={2} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>GitHub</ItemTitle>
            <ItemDescription>
              Connect repositories and sync code
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant="success-light" size="sm">
              Connected
            </Badge>
          </ItemActions>
        </Item>
        <Item variant="outline" size="xs">
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={FigmaIcon} strokeWidth={2} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Figma</ItemTitle>
            <ItemDescription>
              Import designs and sync components
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant="success-light" size="sm">
              Connected
            </Badge>
          </ItemActions>
        </Item>
        <Item variant="outline" size="xs">
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={SlackIcon} strokeWidth={2} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Slack</ItemTitle>
            <ItemDescription>Send notifications to channels</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" size="sm">
              Connect
            </Button>
          </ItemActions>
        </Item>
      </ItemGroup>
    </div>
  );
}

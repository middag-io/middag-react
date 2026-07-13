import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/primitives/reui/item";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  ArrowRight01Icon,
  Shield01Icon,
  CreditCardIcon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col">
      <ItemGroup className="gap-0">
        <Item asChild size="xs">
          <a href="#">
            <ItemMedia variant="icon">
              <HugeiconsIcon icon={UserIcon} strokeWidth={2} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Profile</ItemTitle>
              <ItemDescription>Manage your account details</ItemDescription>
            </ItemContent>
            <ItemActions>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                strokeWidth={2}
                className="text-muted-foreground size-4"
              />
            </ItemActions>
          </a>
        </Item>
        <ItemSeparator />
        <Item asChild size="xs">
          <a href="#">
            <ItemMedia variant="icon">
              <HugeiconsIcon icon={Shield01Icon} strokeWidth={2} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Security</ItemTitle>
              <ItemDescription>Password and two-factor auth</ItemDescription>
            </ItemContent>
            <ItemActions>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                strokeWidth={2}
                className="text-muted-foreground size-4"
              />
            </ItemActions>
          </a>
        </Item>
        <ItemSeparator />
        <Item asChild size="xs">
          <a href="#">
            <ItemMedia variant="icon">
              <HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Billing</ItemTitle>
              <ItemDescription>Plans, invoices, and payment</ItemDescription>
            </ItemContent>
            <ItemActions>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                strokeWidth={2}
                className="text-muted-foreground size-4"
              />
            </ItemActions>
          </a>
        </Item>
      </ItemGroup>
    </div>
  );
}

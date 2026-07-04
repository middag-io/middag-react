import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/reui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/reui/input-group";
import { Kbd } from "@/components/reui/kbd";
import { HugeiconsIcon } from "@hugeicons/react";
import { DashedLineCircleIcon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <Empty className="border">
        <EmptyHeader>
          <EmptyTitle>404 — Not Found</EmptyTitle>
          <EmptyDescription>
            The page you&apos;re looking for doesn&apos;t exist. Try searching
            for what you need below.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <InputGroup className="w-3/4">
            <InputGroupInput placeholder="Try searching for pages…" />
            <InputGroupAddon>
              <HugeiconsIcon icon={DashedLineCircleIcon} strokeWidth={2} />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <Kbd>/</Kbd>
            </InputGroupAddon>
          </InputGroup>
          <EmptyDescription>
            Need help? <a href="#">Contact support</a>
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    </div>
  );
}

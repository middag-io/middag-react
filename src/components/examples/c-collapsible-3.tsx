import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/reui/collapsible";
import { Card, CardContent } from "@/components/reui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <div className="h-40 w-full max-w-xs">
      <Card className="py-3">
        <CardContent className="px-3">
          <Collapsible>
            <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between text-sm">
              <span>How do I reset my password?</span>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                strokeWidth={2}
                aria-hidden="true"
                className="text-muted-foreground size-4 shrink-0 transition-transform in-data-[state=open]:rotate-180"
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
              <div className="text-muted-foreground pt-3 text-sm">
                You can reset your password by clicking the &quot;Forgot
                Password&quot; link on the login page. We&apos;ll send you an
                email with instructions to create a new password.
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  );
}

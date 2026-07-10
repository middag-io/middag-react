import { Card, CardContent } from "@/components/reui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookOpen01Icon, Link01Icon } from "@hugeicons/core-free-icons";

const item = {
  label: "Documentation",
  description:
    "Find guides, API references, and examples to integrate with our platform.",
  link: "View docs",
  icon: (
    <HugeiconsIcon icon={BookOpen01Icon} strokeWidth={2} aria-hidden="true" />
  ),
};

export function Pattern() {
  return (
    <Card className="w-full max-w-xs p-0">
      <CardContent className="p-0">
        <div className="border-b px-4 py-3">
          <div className="text-muted-foreground flex items-center gap-2 [&_svg]:size-4">
            {item.icon}
            <span className="text-foreground text-sm font-medium">
              {item.label}
            </span>
          </div>
        </div>
        <div className="space-y-3 p-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {item.description}
          </p>
          <a
            href="#"
            className="text-primary inline-flex items-center gap-1 text-xs font-medium hover:underline"
          >
            <HugeiconsIcon
              icon={Link01Icon}
              strokeWidth={2}
              aria-hidden="true"
              className="size-2.5 shrink-0"
            />
            {item.link}
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

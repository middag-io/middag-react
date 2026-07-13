import Image from "next/image";
import { Badge } from "@/primitives/reui/badge";

import { Button } from "@/primitives/reui/button";
import { Card, CardContent } from "@/primitives/reui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  NotificationIcon,
  SparklesIcon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Card className="w-full max-w-xs">
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-2xl relative h-48 w-full overflow-hidden">
          <Image
            src="https://picsum.photos/1000/800?grayscale&random=18"
            alt="16:9"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex items-center justify-between gap-5">
          <Badge variant="outline">
            <HugeiconsIcon
              icon={NotificationIcon}
              strokeWidth={2}
              aria-hidden="true"
            />
            Trending
          </Badge>
          <div className="flex items-center gap-1">
            <HugeiconsIcon
              icon={SparklesIcon}
              strokeWidth={2}
              aria-hidden="true"
            />
            <span className="text-secondary-foreground text-xs font-medium">
              Featured
            </span>
          </div>
        </div>

        <p className="text-foreground text-sm">
          Simplifying your workflow from day one. Manage your tasks, projects,
          and team in one place.
        </p>

        <Button>
          Get Started
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            strokeWidth={2}
            aria-hidden="true"
          />
        </Button>
      </CardContent>
    </Card>
  );
}

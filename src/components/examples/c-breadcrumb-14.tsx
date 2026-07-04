import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/reui/breadcrumb";
import { Button } from "@/components/reui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home03Icon,
  ArrowRight01Icon,
  GridViewIcon,
  SettingsIcon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Breadcrumb>
      <BreadcrumbList className="sm:gap-1">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Button variant="ghost" size="sm">
              <HugeiconsIcon icon={Home03Icon} strokeWidth={2} />
              Home
            </Button>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator>
          <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Button variant="ghost" size="sm">
              <HugeiconsIcon icon={GridViewIcon} strokeWidth={2} />
              Workspace
            </Button>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator>
          <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} />
        </BreadcrumbSeparator>

        <BreadcrumbItem>
          <BreadcrumbPage>
            <Button variant="secondary" size="sm">
              <HugeiconsIcon icon={SettingsIcon} strokeWidth={2} />
              Settings
            </Button>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

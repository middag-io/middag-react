import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/primitives/reui/breadcrumb";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home03Icon,
  DashboardSquare02Icon,
  SettingsIcon,
} from "@hugeicons/core-free-icons";

export function Pattern() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#" className="flex items-center gap-1.5">
            <HugeiconsIcon
              icon={Home03Icon}
              strokeWidth={2}
              className="size-4"
            />
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#" className="flex items-center gap-1.5">
            <HugeiconsIcon
              icon={DashboardSquare02Icon}
              strokeWidth={2}
              className="size-4"
            />
            Components
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="flex items-center gap-1.5">
            <HugeiconsIcon
              icon={SettingsIcon}
              strokeWidth={2}
              className="size-4"
            />
            Settings
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

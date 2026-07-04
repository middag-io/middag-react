/**
 * IconPlaceholder — resolves icon by name from Lucide React.
 *
 * ReUI components pass icon names as strings for multiple icon libraries.
 * We resolve the `lucide` prop to the corresponding Lucide React component.
 * Other library props (tabler, hugeicons, phosphor, remixicon) are accepted
 * but ignored — Lucide is our icon library.
 */

import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

interface IconPlaceholderProps extends React.SVGAttributes<SVGSVGElement> {
  lucide?: string;
  tabler?: string;
  hugeicons?: string;
  phosphor?: string;
  remixicon?: string;
}

export function IconPlaceholder({
  lucide,
  tabler: _tabler,
  hugeicons: _hugeicons,
  phosphor: _phosphor,
  remixicon: _remixicon,
  className,
  ...props
}: IconPlaceholderProps) {
  if (!lucide) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (LucideIcons as any)[lucide] as
    | LucideIcons.LucideIcon
    | undefined;
  if (!Icon) return null;

  return <Icon className={cn("size-4", className)} {...props} />;
}

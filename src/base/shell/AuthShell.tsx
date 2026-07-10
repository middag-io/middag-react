/**
 * AuthShell — chromeless, centered shell for guest entry points (login,
 * password reset, magic-link, etc.).
 *
 * BasicShell always renders the app sidebar + nav, and ImmersiveShell adds a
 * close (X) button that implies somewhere to return to — neither fits an
 * unauthenticated entry point. AuthShell renders the page title/subtitle above
 * the content region (typically a `form_panel`) inside a centered card, and
 * ships no chrome of its own. Pair it with `auth: null` (guest) shared props.
 *
 * Branding, logos and demo hints are intentionally NOT baked in here — a host
 * supplies those via the content region or a HostSlot, keeping the engine shell
 * generic across Moodle / WordPress / standalone.
 */

import type { ReactElement } from "react";
import { usePage } from "@inertiajs/react";

import { Toaster } from "@/components/reui/sonner";
import type { PageMeta } from "@/contracts/page-contract";
import type { SharedProps } from "@/contracts/shared-props";
import type { ShellProps } from "@/engine/registries";
import { renderLabel } from "@/i18n/render-label";
import { useTranslation } from "@/i18n/useTranslation";

export function AuthShell({ children }: ShellProps): ReactElement {
  const { t } = useTranslation();
  const { props } = usePage<SharedProps>();

  const page: PageMeta = (props as SharedProps & { contract?: { page?: PageMeta } }).contract
    ?.page ?? {
    key: "unknown",
    title: "",
    breadcrumbs: [],
    actions: [],
  };

  const title = renderLabel(page.title, t);
  const subtitle = renderLabel(page.subtitle, t);

  return (
    <div className="bg-muted/40 text-foreground flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <div className="w-full max-w-sm">
        <div className="bg-card border-border rounded-xl border p-6 shadow-sm">
          {title ? <h1 className="text-foreground text-base font-semibold">{title}</h1> : null}
          {subtitle ? <p className="text-muted-foreground mt-1 mb-4 text-xs">{subtitle}</p> : null}
          {children}
        </div>
      </div>

      <Toaster position="bottom-right" richColors />
    </div>
  );
}

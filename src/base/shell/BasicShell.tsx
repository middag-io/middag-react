/**
 * BasicShell — Community app shell with a simple sidebar + header.
 *
 * The Community counterpart to the Pro ProductShell: a persistent sidebar
 * with flat navigation (no drilldown, quick-find, or command palette) plus a
 * header with title + breadcrumbs and a light/dark toggle. Built entirely from
 * the ReUI sidebar primitives, so any Community consumer gets a usable
 * dashboard frame without @middag-io/react-pro.
 *
 * Reads navigation from shared props (NavigationTreePayload, rendered flat —
 * top-level groups with one level of children) and page meta from the contract.
 * For rich navigation (drilldown, search, chrome panels), use the Pro
 * ProductShell via @middag-io/react-pro's registerProDefaults().
 */

import { type ReactElement } from "react";
import { router } from "@inertiajs/core";
import { Link, usePage } from "@inertiajs/react";

import { useIsDark } from "@/base/hooks/useIsDark";
import { PageActionButton } from "@/base/shell/partials/PageActionButton";
import { setAppearance } from "@/base/theme/appearance";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/reui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/reui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/reui/sidebar";
import { Toaster } from "@/components/reui/sonner";
import type { NavigationNode, NavigationTreePayload } from "@/contracts/navigation";
import type { PageMeta } from "@/contracts/page-contract";
import type { SharedProps, SharedPropsAuth } from "@/contracts/shared-props";
import type { ShellProps } from "@/engine/registries";
import { renderLabel } from "@/i18n/render-label";
import { useTranslation } from "@/i18n/useTranslation";

const EMPTY_NAV: NavigationTreePayload = { tree: [], footer: [], activeKey: "" };

/** A single navigation leaf — a link (or label-only node) inside the menu. */
function NavLeaf({ node, activeKey }: { node: NavigationNode; activeKey: string }): ReactElement {
  const { t } = useTranslation();
  const isActive = node.key === activeKey;
  const label = renderLabel(node.label, t);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild={!!node.href} isActive={isActive}>
        {node.href ? (
          <Link href={node.href} prefetch="hover" aria-current={isActive ? "page" : undefined}>
            <span className="truncate">{label}</span>
          </Link>
        ) : (
          <span className="truncate">{label}</span>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

/**
 * HeaderUserMenu — account avatar + dropdown (identity, logout).
 *
 * The Community shell previously exposed no signed-in identity and no logout
 * affordance (only the sidebar-footer theme toggle). Logout is intentionally
 * data-driven: it POSTs to `logoutUrl` (canonically `auth.logoutUrl`; a
 * top-level `logoutUrl` shared prop is accepted as a fallback) so consumers
 * with different auth backends (Moodle, WordPress) set their own endpoint and
 * the generic shell never hard-codes an app route. The item is hidden entirely
 * when no `logoutUrl` is provided.
 */
function HeaderUserMenu({
  auth,
  logoutUrl,
  csrfToken,
}: {
  auth: SharedPropsAuth;
  logoutUrl?: string;
  csrfToken?: string;
}): ReactElement {
  const { t } = useTranslation();
  const initials =
    auth.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() ?? "")
      .join("") || "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="focus-visible:ring-ring rounded-full transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:outline-none"
          aria-label={auth.name}
        >
          <Avatar className="size-8">
            {auth.avatarUrl ? <AvatarImage src={auth.avatarUrl} alt={auth.name} /> : null}
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">{auth.name}</span>
            {auth.email ? (
              <span className="text-muted-foreground truncate text-xs font-normal">
                {auth.email}
              </span>
            ) : null}
          </div>
        </DropdownMenuLabel>
        {logoutUrl ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={() => router.post(logoutUrl, csrfToken ? { _token: csrfToken } : {})}
            >
              {t("middag.ui.auth.sign_out")}
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function BasicShell({ children }: ShellProps): ReactElement {
  const { t } = useTranslation();
  const { props } = usePage<SharedProps>();
  const isDark = useIsDark();

  const nav: NavigationTreePayload = (props as SharedProps).navigation ?? EMPTY_NAV;
  const page: PageMeta = (props as SharedProps & { contract?: { page?: PageMeta } }).contract
    ?.page ?? { key: "unknown", title: "", breadcrumbs: [], actions: [] };

  // Header-right chrome inputs. `actions` are the contract's page-level actions
  // (Edit, back, etc.) — previously destructured into `page` but never rendered.
  // `logoutUrl`/`csrf_token` are optional shared props the app supplies.
  const auth: SharedPropsAuth | null | undefined = (props as SharedProps).auth;
  const actions = page.actions ?? [];
  // Canonical source is `auth.logoutUrl`; a top-level `logoutUrl` shared prop
  // is accepted as a fallback for hosts that inject it outside the auth object.
  const logoutUrl =
    auth?.logoutUrl ?? ((props as Record<string, unknown>).logoutUrl as string | undefined);
  const csrfToken = (props as Record<string, unknown>).csrf_token as string | undefined;

  return (
    <SidebarProvider>
      <Sidebar collapsible="offcanvas" className="border-sidebar-border bg-sidebar border-r">
        <SidebarHeader className="border-sidebar-border border-b px-4 py-3">
          <span className="text-sidebar-foreground text-sm font-semibold">MIDDAG</span>
        </SidebarHeader>

        <SidebarContent>
          {(nav.tree ?? []).map((node) =>
            node.children?.length ? (
              <SidebarGroup key={node.key}>
                <SidebarGroupLabel>{renderLabel(node.label, t)}</SidebarGroupLabel>
                <SidebarMenu>
                  {node.children.map((child) => (
                    <NavLeaf key={child.key} node={child} activeKey={nav.activeKey} />
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            ) : (
              <SidebarGroup key={node.key}>
                <SidebarMenu>
                  <NavLeaf node={node} activeKey={nav.activeKey} />
                </SidebarMenu>
              </SidebarGroup>
            ),
          )}

          {(nav.footer ?? []).length > 0 && (
            <SidebarGroup className="mt-auto">
              <SidebarMenu>
                {(nav.footer ?? []).map((node) => (
                  <NavLeaf key={node.key} node={node} activeKey={nav.activeKey} />
                ))}
              </SidebarMenu>
            </SidebarGroup>
          )}
        </SidebarContent>

        <SidebarFooter className="border-sidebar-border border-t px-3 py-2">
          <button
            type="button"
            onClick={() => setAppearance(isDark ? "light" : "dark")}
            className="text-muted-foreground hover:bg-sidebar-hover hover:text-sidebar-foreground flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors"
            aria-label={t("middag.ui.appearance.toggle")}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4"
            >
              {isDark ? (
                <circle cx="12" cy="12" r="5" />
              ) : (
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
              )}
            </svg>
            <span>{isDark ? t("middag.ui.appearance.light") : t("middag.ui.appearance.dark")}</span>
          </button>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="border-border flex h-14 shrink-0 items-center gap-3 border-b px-4">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          <div className="flex min-w-0 flex-col">
            {page.breadcrumbs && page.breadcrumbs.length > 0 && (
              <nav
                aria-label="Breadcrumb"
                className="text-muted-foreground flex items-center gap-1 text-xs"
              >
                {page.breadcrumbs.map((crumb, i) => (
                  <span key={`${crumb.label}-${i}`} className="flex items-center gap-1">
                    {i > 0 && <span aria-hidden="true">/</span>}
                    {crumb.href ? (
                      <Link href={crumb.href} className="hover:text-foreground truncate">
                        {renderLabel(crumb.label, t)}
                      </Link>
                    ) : (
                      <span className="truncate">{renderLabel(crumb.label, t)}</span>
                    )}
                  </span>
                ))}
              </nav>
            )}
            {page.title && (
              <span className="text-foreground truncate text-sm font-medium">
                {renderLabel(page.title, t)}
              </span>
            )}
          </div>

          {/* Contract-declared page actions (Edit, back, …) + account menu. */}
          {(actions.length > 0 || auth?.name) && (
            <div className="ml-auto flex shrink-0 items-center gap-2">
              {actions.map((action, i) => (
                <PageActionButton key={action.id ?? i} action={action} />
              ))}
              {auth?.name ? (
                <HeaderUserMenu auth={auth} logoutUrl={logoutUrl} csrfToken={csrfToken} />
              ) : null}
            </div>
          )}
        </header>

        <main
          id="middag-main-content"
          className="flex min-h-0 flex-1 flex-col overflow-auto"
          aria-live="polite"
          aria-busy="false"
        >
          {children}
        </main>
      </SidebarInset>

      <Toaster position="bottom-right" richColors />
    </SidebarProvider>
  );
}

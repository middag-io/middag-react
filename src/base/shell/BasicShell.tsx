/**
 * BasicShell — Community app shell with a simple sidebar + header.
 *
 * The Community counterpart to the Pro ProductShell: a persistent sidebar
 * with flat navigation (no drilldown, quick-find, or command palette) plus a
 * header with title + breadcrumbs and a light/dark toggle. Built entirely from
 * the ReUI sidebar primitives, so any Community consumer gets a usable
 * dashboard frame without @middag-io/react-pro.
 *
 * Reads navigation from shared props (NavigationTree, rendered flat —
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
import type { NavigationNode, NavigationTree } from "@/contracts/navigation";
import type { PageMeta } from "@/contracts/page-contract";
import type { SharedAuth, SharedProps } from "@/contracts/shared-props";
import type { ShellProps } from "@/engine/registries";
import { renderLabel } from "@/i18n/render-label";
import { useTranslation } from "@/i18n/useTranslation";
import { Avatar, AvatarFallback, AvatarImage } from "@/primitives/reui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/primitives/reui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/primitives/reui/sidebar";
import { Toaster } from "@/primitives/reui/sonner";

const EMPTY_NAV: NavigationTree = { tree: [], footer: [], activeKey: "" };

/** An absolute http(s) URL leaves the app, so Inertia must not handle it. */
function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

/** A single navigation leaf — a link (or label-only node) inside the menu. */
function NavLeaf({ node, activeKey }: { node: NavigationNode; activeKey: string }): ReactElement {
  const { t } = useTranslation();
  const isActive = node.key === activeKey;
  const label = renderLabel(node.label, t);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild={!!node.href} isActive={isActive}>
        {node.href && (node.target || isExternalHref(node.href)) ? (
          <a
            href={node.href}
            target={node.target}
            rel="noopener noreferrer"
            aria-current={isActive ? "page" : undefined}
          >
            <span className="truncate">{label}</span>
          </a>
        ) : node.href ? (
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
  auth: SharedAuth;
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

/** Element that renders the page title in the BasicShell header. */
export type BasicShellTitleTag = "h1" | "h2" | "div";

export interface BasicShellProps extends ShellProps {
  /**
   * Element for the page title (default "h1"). Embedded hosts whose page
   * already has an h1 pass "h2" or "div".
   */
  titleAs?: BasicShellTitleTag;
  /** Render the skip-to-content link (default true). Hosts that already render one pass false. */
  skipLink?: boolean;
}

export function BasicShell({
  children,
  titleAs: TitleTag = "h1",
  skipLink = true,
}: BasicShellProps): ReactElement {
  const { t } = useTranslation();
  const { props } = usePage<SharedProps>();
  const isDark = useIsDark();

  const nav: NavigationTree = (props as SharedProps).navigation ?? EMPTY_NAV;
  const page: PageMeta = (props as SharedProps & { contract?: { page?: PageMeta } }).contract
    ?.page ?? { key: "unknown", title: "", breadcrumbs: [], actions: [] };

  // Header-right chrome inputs. `actions` are the contract's page-level actions
  // (Edit, back, etc.) — previously destructured into `page` but never rendered.
  // `logoutUrl`/`csrf_token` are optional shared props the app supplies.
  const auth: SharedAuth | null | undefined = (props as SharedProps).auth;
  const actions = page.actions ?? [];
  // Canonical source is `auth.logoutUrl`; a top-level `logoutUrl` shared prop
  // is accepted as a fallback for hosts that inject it outside the auth object.
  const logoutUrl =
    auth?.logoutUrl ?? ((props as Record<string, unknown>).logoutUrl as string | undefined);
  const csrfToken = (props as Record<string, unknown>).csrf_token as string | undefined;

  return (
    <SidebarProvider>
      {/* First focusable element: lets keyboard users skip the navigation. */}
      {/* Hidden until focused by an unlayered rule in tailwind.css, not by
          sr-only: host themes (Bootstrap) ship their own unlayered .sr-only,
          which would keep the link clipped even on focus. */}
      {skipLink && (
        <a
          href="#middag-main-content"
          data-slot="skip-link"
          className="bg-background text-foreground focus-visible:ring-ring rounded-md px-3 py-2 text-sm font-medium shadow-md focus-visible:ring-2 focus-visible:outline-none"
        >
          {t("middag.ui.shell.skip_to_content")}
        </a>
      )}

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

      {/* Same box as SidebarInset, but a div: SidebarInset renders a <main>, and
          the content area below is the page's only main landmark. */}
      <div data-slot="sidebar-inset" className="bg-background relative flex w-full flex-1 flex-col">
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
            {/* The page title is the level-1 heading. The wrapper carries the
                look; the title element (h1 unless titleAs says otherwise)
                inherits it (tailwind.css resets host h1 styles
                such as Moodle's on [data-slot="page-title"]). */}
            {page.title && (
              <div className="text-foreground min-w-0 text-sm font-medium">
                <TitleTag data-slot="page-title" className="truncate">
                  {renderLabel(page.title, t)}
                </TitleTag>
              </div>
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
          tabIndex={-1}
          className="flex min-h-0 flex-1 flex-col overflow-auto focus:outline-none"
          aria-live="polite"
          aria-busy="false"
        >
          {children}
        </main>
      </div>

      <Toaster position="bottom-right" richColors />
    </SidebarProvider>
  );
}

/**
 * resolveActionTarget — normalizes an action's navigation target into a single
 * shape that both the legacy flat contract (href + method on the action) and the
 * canonical php-ui v0.5.0 contract (discriminated `target: ActionTarget`) collapse to.
 *
 * Phase-0 adapter seam: block components route every navigation/request through this
 * helper instead of reading `action.href` / `action.method` inline, so the later
 * structural flip to the canonical Action shape is a type-only change with no
 * per-call-site churn.
 *
 * Transitional: the local `ActionTargetInput` / `ResolvableAction` types are replaced
 * by the generated contracts types in Phase 2. Until then this reads BOTH shapes.
 *
 * NOTE: `url` may contain `{placeholder}` tokens (DenseTable interpolates them per
 * row). This helper does NOT interpolate — callers interpolate `resolved.url`.
 */

/** HTTP method, including PATCH (php-ui HttpMethod). */
export type ResolvedActionMethod = "get" | "post" | "put" | "patch" | "delete";

/** Discriminated target kind — mirror of php-ui ActionTargetKind. */
export type ActionTargetKind = "link" | "route" | "request";

/**
 * Canonical discriminated target (php-ui ActionTarget VO). Defined locally for the
 * Phase-0 compatibility window; replaced by the generated contracts type in Phase 2.
 */
export interface ActionTargetInput {
  kind: ActionTargetKind;
  /** kind=link: destination URL. */
  href?: string;
  /** kind=link: open as external / new tab. */
  external?: boolean;
  /** kind=route: named route. */
  route?: string;
  /** kind=route: route params. */
  params?: Record<string, unknown>;
  /** kind=request: request endpoint URL. */
  endpoint?: string;
  /** kind=request: HTTP method. */
  method?: ResolvedActionMethod;
}

/**
 * Any action this helper can resolve: carries either a canonical `target` (new) or
 * legacy flat `href` + `method` fields (current), or both during the migration.
 */
export interface ResolvableAction {
  href?: string;
  method?: string;
  target?: ActionTargetInput;
}

/** Normalized navigation target. */
export interface ResolvedActionTarget {
  kind: ActionTargetKind;
  /**
   * Destination URL for `link` and `request` kinds. Empty string for pure `route`
   * targets. May contain `{placeholder}` tokens — callers interpolate per row.
   */
  url: string;
  /** Named route, when kind === "route". */
  route?: string;
  /** Route params, when kind === "route". */
  params?: Record<string, unknown>;
  /** HTTP method. "get" for link/route, request method otherwise. */
  method: ResolvedActionMethod;
  /** Whether the link points outside the app. */
  external: boolean;
}

function normalizeMethod(
  method: string | undefined,
  fallback: ResolvedActionMethod,
): ResolvedActionMethod {
  switch (method) {
    case "get":
    case "post":
    case "put":
    case "patch":
    case "delete":
      return method;
    default:
      return fallback;
  }
}

/**
 * Resolve an action (legacy flat or canonical `target`) to a normalized target.
 *
 * Resolution order: a canonical `target` wins when present; otherwise the legacy
 * flat `href` + `method` are read and the kind is derived from the method
 * (`get` → link, anything else → request).
 */
export function resolveActionTarget(action: ResolvableAction): ResolvedActionTarget {
  const target = action.target;

  if (target) {
    switch (target.kind) {
      case "link":
        return {
          kind: "link",
          url: target.href ?? "",
          method: "get",
          external: target.external ?? false,
        };
      case "route":
        return {
          kind: "route",
          url: "",
          route: target.route,
          params: target.params,
          method: "get",
          external: false,
        };
      case "request":
        return {
          kind: "request",
          url: target.endpoint ?? target.href ?? "",
          method: normalizeMethod(target.method, "post"),
          external: false,
        };
    }
  }

  // Legacy flat shape: derive kind from method.
  const method = normalizeMethod(action.method, "get");
  return {
    kind: method === "get" ? "link" : "request",
    url: action.href ?? "",
    method,
    external: false,
  };
}

/** True when the target is in-app/external navigation (a GET link or named route). */
export function isNavigationTarget(target: ResolvedActionTarget): boolean {
  return target.kind === "link" || target.kind === "route";
}

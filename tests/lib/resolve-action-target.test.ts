/**
 * resolveActionTarget — adapter-seam normalization (Phase 0).
 *
 * Verifies both the legacy flat shape (href + method) and the canonical
 * discriminated `target` shape collapse to the same normalized target.
 */

import { describe, expect, it } from "vitest";

import {
  isNavigationTarget,
  resolveActionTarget,
  type ResolvableAction,
} from "@/lib/actions/resolve-action-target";

describe("resolveActionTarget — legacy flat shape", () => {
  it("treats a missing method as a GET link", () => {
    const r = resolveActionTarget({ href: "/courses" });
    expect(r).toEqual({ kind: "link", url: "/courses", method: "get", external: false });
  });

  it("treats an explicit get method as a link", () => {
    const r = resolveActionTarget({ href: "/courses", method: "get" });
    expect(r.kind).toBe("link");
    expect(r.method).toBe("get");
  });

  it("treats post/put/patch/delete as a request", () => {
    for (const method of ["post", "put", "patch", "delete"] as const) {
      const r = resolveActionTarget({ href: "/courses/1", method });
      expect(r.kind).toBe("request");
      expect(r.method).toBe(method);
      expect(r.url).toBe("/courses/1");
    }
  });

  it("falls back to GET link for an unknown method string", () => {
    const r = resolveActionTarget({ href: "/x", method: "options" });
    expect(r.kind).toBe("link");
    expect(r.method).toBe("get");
  });

  it("preserves {placeholder} tokens in the url (no interpolation)", () => {
    const r = resolveActionTarget({ href: "/courses/{id}/edit", method: "put" });
    expect(r.url).toBe("/courses/{id}/edit");
  });

  it("yields an empty url when href is absent", () => {
    const r = resolveActionTarget({ method: "post" });
    expect(r.url).toBe("");
    expect(r.kind).toBe("request");
  });
});

describe("resolveActionTarget — canonical target shape", () => {
  it("resolves a link target", () => {
    const action: ResolvableAction = { target: { kind: "link", href: "/docs", external: true } };
    const r = resolveActionTarget(action);
    expect(r).toEqual({ kind: "link", url: "/docs", method: "get", external: true });
  });

  it("defaults external to false for a link target", () => {
    const r = resolveActionTarget({ target: { kind: "link", href: "/docs" } });
    expect(r.external).toBe(false);
  });

  it("resolves a route target", () => {
    const r = resolveActionTarget({
      target: { kind: "route", route: "course.show", params: { id: 7 } },
    });
    expect(r.kind).toBe("route");
    expect(r.route).toBe("course.show");
    expect(r.params).toEqual({ id: 7 });
    expect(r.url).toBe("");
    expect(r.method).toBe("get");
  });

  it("resolves a request target with explicit method", () => {
    const r = resolveActionTarget({
      target: { kind: "request", endpoint: "/api/sync", method: "patch" },
    });
    expect(r).toEqual({ kind: "request", url: "/api/sync", method: "patch", external: false });
  });

  it("defaults a request target method to post", () => {
    const r = resolveActionTarget({ target: { kind: "request", endpoint: "/api/run" } });
    expect(r.method).toBe("post");
  });

  it("prefers target over legacy flat fields when both are present", () => {
    const r = resolveActionTarget({
      href: "/legacy",
      method: "delete",
      target: { kind: "link", href: "/canonical" },
    });
    expect(r.kind).toBe("link");
    expect(r.url).toBe("/canonical");
  });
});

describe("isNavigationTarget", () => {
  it("is true for link and route, false for request", () => {
    expect(isNavigationTarget(resolveActionTarget({ href: "/x" }))).toBe(true);
    expect(isNavigationTarget(resolveActionTarget({ target: { kind: "route", route: "r" } }))).toBe(
      true,
    );
    expect(isNavigationTarget(resolveActionTarget({ href: "/x", method: "post" }))).toBe(false);
  });
});

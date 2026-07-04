import { afterAll, beforeAll, describe, expect, it } from "vitest";

import type { FieldError } from "@/contracts/block-data/form";
import { i18n, i18nReady } from "@/i18n/instance";
import { resolveFieldError } from "@/i18n/resolve-field-error";

describe("resolveFieldError", () => {
  // The library i18next instance is a shared module-level singleton across all
  // test suites. Pin pt-BR for this suite and restore en after, so execution
  // order never leaks a language into sibling suites.
  beforeAll(async () => {
    await i18nReady;
    await i18n.changeLanguage("pt-BR");
  });

  afterAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("re-translates a known validators key with params", () => {
    const e: FieldError = {
      message: "This value is too short. It should have 5 characters or more.",
      key: "validation.length.too_short",
      domain: "validators",
      params: { limit: 5 },
    };
    expect(resolveFieldError(e, i18n.t)).toBe(
      "Este valor é muito curto. Deve ter 5 caracteres ou mais.",
    );
  });

  it("falls back to the server .message when the key is unknown", () => {
    const e: FieldError = {
      message: "Server only message",
      key: "validation.unmapped_xyz",
      domain: "validators",
    };
    expect(resolveFieldError(e, i18n.t)).toBe("Server only message");
  });

  // ── custom / host domain (F-02 residual) ─────────────────────────────────
  // `error.domain` is not restricted to "validators": a host (Moodle/WP) can
  // ship its own error namespace. resolveFieldError maps domain -> ns
  // dynamically, so a key registered under an arbitrary namespace resolves,
  // and an unmapped key in that same namespace still falls back to .message.

  it("re-translates a key from a custom host domain namespace", () => {
    i18n.addResourceBundle(
      "pt-BR",
      "host",
      { "profile.email_taken": "Este e-mail já está em uso." },
      true,
      true,
    );
    const e: FieldError = {
      message: "This email is already in use.",
      key: "profile.email_taken",
      domain: "host",
    };
    expect(resolveFieldError(e, i18n.t)).toBe("Este e-mail já está em uso.");
  });

  it("falls back to .message for an unknown key in a custom domain", () => {
    const e: FieldError = {
      message: "Host-supplied fallback text",
      key: "profile.unmapped_field",
      domain: "host",
    };
    expect(resolveFieldError(e, i18n.t)).toBe("Host-supplied fallback text");
  });

  it("preserves raw string errors from the server", () => {
    expect(resolveFieldError("Title is required", i18n.t)).toBe("Title is required");
  });

  it("joins multiple errors for the same field", () => {
    const errors: FieldError[] = [
      {
        message: "First server message",
        key: "validation.unmapped_first",
        domain: "validators",
      },
      {
        message: "Second server message",
        key: "validation.unmapped_second",
        domain: "validators",
      },
    ];

    expect(resolveFieldError(errors, i18n.t)).toBe("First server message Second server message");
  });
});

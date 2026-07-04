import { beforeAll, describe, expect, it } from "vitest";

import { i18n, i18nReady } from "@/i18n/instance";

describe("i18next instance", () => {
  beforeAll(async () => {
    await i18nReady;
  });

  it("interpolates with single braces (framework {param} contract)", () => {
    const msg = i18n.t("validation.length.too_short", {
      ns: "validators",
      lng: "en",
      limit: 5,
    });
    expect(msg).toBe("This value is too short. It should have 5 characters or more.");
  });

  it("falls back to the provided defaultValue when a key is missing", () => {
    const msg = i18n.t("validation.brand_new_key", {
      ns: "validators",
      lng: "en",
      defaultValue: "Server resolved message",
    });
    expect(msg).toBe("Server resolved message");
  });

  it("resolves pt-BR validators", () => {
    const msg = i18n.t("validation.required", { ns: "validators", lng: "pt-BR" });
    expect(msg).toBe("Este campo é obrigatório.");
  });

  it("resolves a migrated ui key", async () => {
    await i18n.changeLanguage("en");
    expect(i18n.t("middag.ui.shell.skip_to_content", { ns: "ui" })).toBe("Skip to main content");
  });
});

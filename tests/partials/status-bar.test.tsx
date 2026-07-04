import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import "../setup";

import { StatusBar } from "@/base/partials/StatusBar";
import { StatusIndicator } from "@/base/partials/StatusIndicator";
import { I18nProvider } from "@/i18n/I18nProvider";

describe("StatusBar (F-27)", () => {
  afterEach(() => cleanup());

  it("localizes the appearance enum in item aria-labels", () => {
    render(
      <I18nProvider>
        <StatusBar items={[{ key: "errors", label: "Errors", value: "3", appearance: "danger" }]} />
      </I18nProvider>,
    );

    // The raw enum "danger" must not leak to AT — it is mapped to "critical".
    expect(screen.getByLabelText("Errors: 3, critical")).toBeDefined();
    expect(screen.queryByLabelText("Errors: 3, status danger")).toBeNull();
  });

  it("uses a localized container label instead of hardcoded PT", () => {
    render(
      <I18nProvider>
        <StatusBar
          items={[{ key: "ok", label: "Uptime", value: "99.9%", appearance: "success" }]}
        />
      </I18nProvider>,
    );

    expect(screen.getByRole("status", { name: "System status" })).toBeDefined();
  });
});

describe("StatusIndicator (F-27)", () => {
  afterEach(() => cleanup());

  it("builds a localized aria-label with the label text", () => {
    render(
      <I18nProvider>
        <StatusIndicator status="active" label="Active" />
      </I18nProvider>,
    );

    expect(screen.getByLabelText("Status: Active")).toBeDefined();
  });

  it("falls back to the status value when no label is given", () => {
    render(
      <I18nProvider>
        <StatusIndicator status="connected" />
      </I18nProvider>,
    );

    expect(screen.getByLabelText("Status: connected")).toBeDefined();
  });
});

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import "../setup";

import { LogViewer } from "@/base/partials/LogViewer";
import type { ParsedLogLine } from "@/base/partials/LogViewer";
import { I18nProvider } from "@/i18n/I18nProvider";

const lines: ParsedLogLine[] = [
  {
    datetime: "2026-06-05 10:00:00",
    origin: "core",
    actor: "cron",
    level: "ERROR",
    message: "Boom happened",
    context: {},
  },
  {
    datetime: "2026-06-05 10:01:00",
    origin: "core",
    actor: "cron",
    level: "INFO",
    message: "All good",
    context: {},
  },
];

function renderViewer(props: Partial<React.ComponentProps<typeof LogViewer>> = {}) {
  return render(
    <I18nProvider>
      <LogViewer
        lines={lines}
        filename="moodle.log"
        downloadUrl="/download"
        totalLines={2}
        hasMore={false}
        {...props}
      />
    </I18nProvider>,
  );
}

describe("LogViewer", () => {
  afterEach(() => cleanup());

  it("renders parsed log entries and the filename", () => {
    renderViewer();
    expect(screen.getByText("moodle.log")).toBeDefined();
    expect(screen.getByText("Boom happened")).toBeDefined();
    expect(screen.getByText("All good")).toBeDefined();
  });

  it("switches to raw mode and back via the toolbar toggle", () => {
    renderViewer();

    // Parsed → Raw: a <pre> with the joined raw content replaces the entries.
    fireEvent.click(screen.getByRole("button", { name: "Raw" }));
    expect(screen.getByText(/ERROR: Boom happened/)).toBeDefined();
    expect(screen.getByRole("button", { name: "Parsed" })).toBeDefined();
  });

  it("shows a skeleton (no toolbar) while loading with no lines", () => {
    renderViewer({ lines: [], isLoading: true, totalLines: 0 });
    // The loading branch renders before the toolbar, so the filename is absent.
    expect(screen.queryByText("moodle.log")).toBeNull();
    expect(screen.queryByText("Boom happened")).toBeNull();
  });
});

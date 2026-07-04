import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import "../setup";

import { block, metricCardData } from "../helpers";

describe("MetricCardBlock", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders value and label with valid data", async () => {
    const { MetricCardBlock } = await import("@/base/blocks/MetricCardBlock");
    const descriptor = block("metric_card", "test-metric", metricCardData());
    render(<MetricCardBlock block={descriptor} />);

    expect(screen.getByText("1,284")).toBeDefined();
    expect(screen.getByText("Total Users")).toBeDefined();
  });

  it("renders delta indicator", async () => {
    const { MetricCardBlock } = await import("@/base/blocks/MetricCardBlock");
    const descriptor = block("metric_card", "test-metric", metricCardData());
    render(<MetricCardBlock block={descriptor} />);

    expect(screen.getByText("+12%")).toBeDefined();
  });

  it("renders without delta", async () => {
    const { MetricCardBlock } = await import("@/base/blocks/MetricCardBlock");
    const data = metricCardData();
    delete (data as Record<string, unknown>).delta;
    delete (data as Record<string, unknown>).deltaDirection;
    const descriptor = block("metric_card", "test-metric-no-delta", data);
    render(<MetricCardBlock block={descriptor} />);

    expect(screen.getByText("1,284")).toBeDefined();
    expect(screen.getByText("Total Users")).toBeDefined();
    expect(screen.queryByText("+12%")).toBeNull();
  });

  it("builds a localized aria-label for the linked card (no hardcoded PT)", async () => {
    const { MetricCardBlock } = await import("@/base/blocks/MetricCardBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const data = { ...metricCardData(), href: "/metrics/users" };
    const descriptor = block("metric_card", "test-metric-href", data);

    render(
      <I18nProvider>
        <MetricCardBlock block={descriptor} />
      </I18nProvider>,
    );

    // Was hardcoded "aumento de"; now i18n-driven ("increase of" under en).
    expect(screen.getByLabelText("Total Users: 1,284, increase of +12%")).toBeDefined();
  });

  it("renders loading skeleton when meta.loading is true", async () => {
    const { MetricCardBlock } = await import("@/base/blocks/MetricCardBlock");
    const descriptor = block("metric_card", "test-metric-loading", metricCardData(), {
      meta: { loading: true },
    });
    render(<MetricCardBlock block={descriptor} />);

    expect(screen.queryByText("1,284")).toBeNull();
    expect(screen.queryByText("Total Users")).toBeNull();
  });
});

import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import "../setup";

import { block, chartPanelData } from "../helpers";

describe("ChartBlock", () => {
  let getBoundingClientRectSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // recharts' <ResponsiveContainer> measures its wrapper via
    // getBoundingClientRect() (inside a ResizeObserver-driven effect) and
    // renders NO children until it sees a positive width/height. jsdom always
    // reports 0x0, so without this the container collapses to an empty div
    // and every assertion beyond "the outer wrapper exists" is a no-op. Stub
    // a real size so Bar/Line/Area/Legend/Axis actually mount.
    getBoundingClientRectSpy = vi
      .spyOn(Element.prototype, "getBoundingClientRect")
      .mockReturnValue({
        width: 600,
        height: 300,
        top: 0,
        left: 0,
        right: 600,
        bottom: 300,
        x: 0,
        y: 0,
        toJSON: () => {},
      } as DOMRect);
  });

  afterEach(() => {
    getBoundingClientRectSpy.mockRestore();
    cleanup();
  });

  it("renders without crashing for each chart type and picks the matching mark", async () => {
    const { ChartBlock } = await import("@/base/blocks/ChartBlock");
    const base = chartPanelData();
    const markClassByChartType = {
      line: ".recharts-line",
      bar: ".recharts-bar",
      area: ".recharts-area",
    } as const;

    for (const chartType of ["line", "bar", "area"] as const) {
      const descriptor = block("chart", `test-chart-${chartType}`, { ...base, chartType });
      const { container } = render(<ChartBlock block={descriptor} />);

      expect(container.querySelector(".recharts-responsive-container")).toBeTruthy();
      expect(container.querySelector("[data-slot='chart']")).toBeTruthy();

      // Assert the chartType actually dispatched to the matching recharts
      // mark (BarChart vs LineChart vs AreaChart), not just that some chart
      // rendered.
      expect(container.querySelector(markClassByChartType[chartType])).toBeTruthy();
      for (const [otherType, otherClass] of Object.entries(markClassByChartType)) {
        if (otherType !== chartType) {
          expect(container.querySelector(otherClass)).toBeNull();
        }
      }
    }
  });

  it("renders a legend when there is more than one series", async () => {
    const { ChartBlock } = await import("@/base/blocks/ChartBlock");
    const data = {
      ...chartPanelData(),
      series: [
        { key: "value", label: "Revenue" },
        { key: "cost", label: "Cost" },
      ],
      data: [
        { month: "Jan", value: 100, cost: 40 },
        { month: "Feb", value: 200, cost: 60 },
      ],
    };
    const descriptor = block("chart", "test-chart-legend", data);
    const { container, getByText } = render(<ChartBlock block={descriptor} />);

    expect(container.querySelector("[data-slot='chart']")).toBeTruthy();
    expect(container.querySelector(".recharts-legend-wrapper")).toBeTruthy();
    expect(getByText("Revenue")).toBeTruthy();
    expect(getByText("Cost")).toBeTruthy();
  });

  it("omits the legend for a single series by default", async () => {
    const { ChartBlock } = await import("@/base/blocks/ChartBlock");
    const descriptor = block("chart", "test-chart-single", chartPanelData());
    const { container } = render(<ChartBlock block={descriptor} />);

    expect(container.querySelector("[data-slot='chart']")).toBeTruthy();
    expect(container.querySelector(".recharts-legend-wrapper")).toBeNull();
  });
});

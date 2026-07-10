/**
 * ChartBlock — free-tier chart renderer (line / bar / area). Reads the
 * middag-php-ui `chart` wire shape: { chartType, categoryKey, series, data }.
 * The premium `chart_panel` (pie, playground, richer config) lives in
 * @middag-io/react-pro.
 */

import type { ReactElement } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/reui/chart";
import type { ChartBlockData } from "@/contracts/block-data";
import type { BlockProps } from "@/engine/registries";

export function ChartBlock({ block }: BlockProps<ChartBlockData>): ReactElement {
  const { chartType, categoryKey, series, data, options } = block.data;

  const config: ChartConfig = Object.fromEntries(
    series.map((s, i) => [
      s.key,
      { label: s.label, color: s.color ?? `var(--chart-${(i % 5) + 1})` },
    ]),
  );

  const showGrid = options?.showGrid ?? true;
  const showLegend = options?.showLegend ?? series.length > 1;

  const grid = showGrid ? <CartesianGrid vertical={false} /> : null;
  const axis = <XAxis dataKey={categoryKey} tickLine={false} axisLine={false} tickMargin={8} />;
  const tooltip = <ChartTooltip content={<ChartTooltipContent />} />;
  const legend = showLegend ? <ChartLegend content={<ChartLegendContent />} /> : null;

  return (
    <ChartContainer config={config}>
      {chartType === "bar" ? (
        <BarChart data={data}>
          {grid}
          {axis}
          {tooltip}
          {legend}
          {series.map((s) => (
            <Bar key={s.key} dataKey={s.key} fill={`var(--color-${s.key})`} radius={4} />
          ))}
        </BarChart>
      ) : chartType === "area" ? (
        <AreaChart data={data}>
          {grid}
          {axis}
          {tooltip}
          {legend}
          {series.map((s) => (
            <Area
              key={s.key}
              dataKey={s.key}
              stroke={`var(--color-${s.key})`}
              fill={`var(--color-${s.key})`}
              fillOpacity={0.2}
            />
          ))}
        </AreaChart>
      ) : (
        <LineChart data={data}>
          {grid}
          {axis}
          {tooltip}
          {legend}
          {series.map((s) => (
            <Line key={s.key} dataKey={s.key} stroke={`var(--color-${s.key})`} dot={false} />
          ))}
        </LineChart>
      )}
    </ChartContainer>
  );
}

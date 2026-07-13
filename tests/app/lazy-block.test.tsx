/**
 * LazyBlock — strategy dispatch tests.
 *
 * Mocks @inertiajs/react locally (not ../setup) so each strategy can be driven
 * in isolation: <Deferred>/<WhenVisible> stubs expose their props via testids
 * and render children eagerly; usePage feeds the resolved lazy prop.
 */

import type { ReactElement, ReactNode } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { BlockDescriptor } from "@/contracts/page-contract";
import { isLazyBlock, LazyBlock } from "@/engine/LazyBlock";
import type { BlockProps } from "@/engine/registries";

const h = vi.hoisted(() => ({
  pageProps: { current: {} as Record<string, unknown> },
}));

vi.mock("@inertiajs/react", () => ({
  usePage: () => ({ props: h.pageProps.current }),
  Deferred: ({ data, children }: Record<string, unknown>) => (
    <div data-testid="deferred" data-prop={String(data)}>
      {children as ReactNode}
    </div>
  ),
  WhenVisible: ({ data, buffer, children }: Record<string, unknown>) => (
    <div data-testid="whenvisible" data-prop={String(data)} data-buffer={String(buffer)}>
      {children as ReactNode}
    </div>
  ),
}));

function Dummy({ block }: BlockProps<Record<string, unknown>>): ReactElement {
  return <div data-testid="content">{JSON.stringify(block.data)}</div>;
}

function makeBlock(overrides: Partial<BlockDescriptor> = {}): BlockDescriptor {
  return { type: "demo", key: "b1", data: {}, ...overrides } as BlockDescriptor;
}

beforeEach(() => {
  h.pageProps.current = {};
});

afterEach(() => {
  cleanup();
});

describe("LazyBlock — strategy dispatch", () => {
  it("renders eagerly when there is no lazyProp", () => {
    render(<LazyBlock block={makeBlock({ data: { eager: true } })} Component={Dummy} />);

    expect(screen.getByTestId("content")).toHaveTextContent('"eager":true');
    expect(screen.queryByTestId("deferred")).toBeNull();
    expect(screen.queryByTestId("whenvisible")).toBeNull();
  });

  it("uses <Deferred> with the prop name when block.deferred is true", () => {
    h.pageProps.current = { invoices: { total: 5 } };

    render(
      <LazyBlock
        block={makeBlock({ meta: { lazyProp: "invoices" }, deferred: true })}
        Component={Dummy}
      />,
    );

    expect(screen.getByTestId("deferred")).toHaveAttribute("data-prop", "invoices");
    expect(screen.getByTestId("content")).toHaveTextContent('"total":5');
  });

  it("defaults to <Deferred> for any lazyProp block (no flags)", () => {
    h.pageProps.current = { invoices: { total: 7 } };

    render(<LazyBlock block={makeBlock({ meta: { lazyProp: "invoices" } })} Component={Dummy} />);

    expect(screen.getByTestId("deferred")).toHaveAttribute("data-prop", "invoices");
    expect(screen.queryByTestId("whenvisible")).toBeNull();
    expect(screen.getByTestId("content")).toHaveTextContent('"total":7');
  });

  it("uses <WhenVisible> (with buffer) and takes precedence over deferred", () => {
    h.pageProps.current = { invoices: { total: 9 } };

    render(
      <LazyBlock
        block={makeBlock({
          meta: { lazyProp: "invoices", whenVisible: true, buffer: 200 },
          deferred: true,
        })}
        Component={Dummy}
      />,
    );

    const wrap = screen.getByTestId("whenvisible");
    expect(wrap).toHaveAttribute("data-prop", "invoices");
    expect(wrap).toHaveAttribute("data-buffer", "200");
    expect(screen.queryByTestId("deferred")).toBeNull();
    expect(screen.getByTestId("content")).toHaveTextContent('"total":9');
  });
});

describe("isLazyBlock", () => {
  it("is true only when meta.lazyProp is a string", () => {
    expect(isLazyBlock(makeBlock({ meta: { lazyProp: "x" } }))).toBe(true);
    expect(isLazyBlock(makeBlock())).toBe(false);
    // deferred without a prop name is not actionable
    expect(isLazyBlock(makeBlock({ deferred: true }))).toBe(false);
  });
});

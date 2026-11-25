/**
 * EmptyPlaceholder Lottie and prefers-reduced-motion.
 *
 * The canvas animation is not stopped by the CSS reduced-motion rule, so the
 * component itself must not play or loop it when the user asked for less
 * motion.
 */

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const lottieProps = vi.fn();

vi.mock("@lottiefiles/dotlottie-react", () => ({
  DotLottieReact: (props: { loop?: boolean; autoplay?: boolean }) => {
    lottieProps(props);
    return <div data-testid="lottie" />;
  },
}));

function mockReducedMotion(matches: boolean): void {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)" ? matches : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
}

describe("EmptyPlaceholder Lottie motion", () => {
  afterEach(() => {
    cleanup();
    lottieProps.mockClear();
    vi.unstubAllGlobals();
  });

  it("loops and autoplays when motion is allowed", async () => {
    // Arrange
    mockReducedMotion(false);
    const { EmptyPlaceholder } = await import("@/base/partials/EmptyPlaceholder");

    // Act
    render(<EmptyPlaceholder title="Nothing here" lottieUrl="/anim.lottie" />);
    await screen.findByTestId("lottie");

    // Assert
    expect(lottieProps).toHaveBeenLastCalledWith(
      expect.objectContaining({ loop: true, autoplay: true }),
    );
  });

  it("neither loops nor autoplays when the user prefers reduced motion", async () => {
    mockReducedMotion(true);
    const { EmptyPlaceholder } = await import("@/base/partials/EmptyPlaceholder");

    render(<EmptyPlaceholder title="Nothing here" lottieUrl="/anim.lottie" />);
    await screen.findByTestId("lottie");

    expect(lottieProps).toHaveBeenLastCalledWith(
      expect.objectContaining({ loop: false, autoplay: false }),
    );
  });
});

/**
 * Regression test for the inspector "close does nothing" bug.
 *
 * DenseTableBlock auto-selects the first row whenever the inspector is
 * enabled and nothing is selected (`selectedId == null`). That guard can't
 * tell "nothing selected yet since mount" apart from "user just clicked the
 * X to close" — both leave selectedId null, so the effect re-fires and
 * immediately re-selects the first row. Clicking the drawer's close button
 * (InlineInspector, in @middag-io/react-pro) calls the same `close()` this
 * test calls directly; the effect must not undo it.
 */
import { useCallback, useState } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import "../setup";

import { block, denseTableData } from "../helpers";
import { InspectorContext } from "@/base/shell/partials/InspectorContext";

vi.mock("@/base/hooks/usePolling", () => ({
  usePolling: vi.fn(),
}));

/** Minimal stand-in for react-pro's InspectorProvider — same select/close semantics. */
function TestInspectorProvider({ children }: { children: React.ReactNode }) {
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const select = useCallback((id: string | number) => setSelectedId(id), []);
  const close = useCallback(() => setSelectedId(null), []);

  return (
    <InspectorContext.Provider
      value={{ selectedId, select, close, enabled: true, data: null, loading: false, width: 380 }}
    >
      {children}
      <button onClick={close}>close-inspector</button>
    </InspectorContext.Provider>
  );
}

describe("DenseTableBlock — inspector auto-select vs. manual close", () => {
  afterEach(() => {
    cleanup();
  });

  it("does not re-select the first row after the drawer is closed", async () => {
    const { DenseTableBlock } = await import("@/base/blocks/DenseTableBlock");
    const { I18nProvider } = await import("@/i18n/I18nProvider");
    const descriptor = block("dense_table", "test-table-autoselect", denseTableData());

    render(
      <I18nProvider>
        <TestInspectorProvider>
          <DenseTableBlock block={descriptor} />
        </TestInspectorProvider>
      </I18nProvider>,
    );

    // Auto-select fires on mount — row "Alice" (id 1) starts selected.
    const aliceRow = await screen.findByText("Alice").then((el) => el.closest("tr"));
    expect(aliceRow).not.toBeNull();
    expect(aliceRow).toHaveAttribute("data-state", "selected");

    // User clicks the drawer's X (calls the same close() InlineInspector uses).
    fireEvent.click(screen.getByText("close-inspector"));

    // Must stay closed — the auto-select effect must not immediately re-fire.
    expect(aliceRow).not.toHaveAttribute("data-state", "selected");
  });
});

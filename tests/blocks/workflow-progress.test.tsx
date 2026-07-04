import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import "../setup";

import { block, workflowProgressData } from "../helpers";

describe("WorkflowProgressBlock", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders all state labels", async () => {
    const { WorkflowProgressBlock } = await import("@/base/blocks/WorkflowProgressBlock");
    const descriptor = block("workflow_progress", "test-workflow", workflowProgressData());
    render(<WorkflowProgressBlock block={descriptor} />);

    expect(screen.getByText("Draft")).toBeDefined();
    expect(screen.getByText("Review")).toBeDefined();
    expect(screen.getByText("Approved")).toBeDefined();
    expect(screen.getByText("Published")).toBeDefined();
  });

  it("shows timestamp for past and current states", async () => {
    const { WorkflowProgressBlock } = await import("@/base/blocks/WorkflowProgressBlock");
    const descriptor = block("workflow_progress", "test-workflow", workflowProgressData());
    render(<WorkflowProgressBlock block={descriptor} />);

    // Draft (past) and Review (current) have timestamps
    expect(screen.getByText("Jan 1")).toBeDefined();
    expect(screen.getByText("Jan 5")).toBeDefined();
  });

  it("handles single state", async () => {
    const { WorkflowProgressBlock } = await import("@/base/blocks/WorkflowProgressBlock");
    const data = {
      states: [{ key: "only", label: "Only State" }],
      currentState: "only",
    };
    const descriptor = block("workflow_progress", "test-workflow-single", data);
    render(<WorkflowProgressBlock block={descriptor} />);

    expect(screen.getByText("Only State")).toBeDefined();
  });

  it("exposes a list with one item per state and marks the current step", async () => {
    const { WorkflowProgressBlock } = await import("@/base/blocks/WorkflowProgressBlock");
    const descriptor = block("workflow_progress", "test-workflow-a11y", workflowProgressData());
    render(<WorkflowProgressBlock block={descriptor} />);

    expect(screen.getByRole("list")).toBeDefined();
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(4);

    // Exactly one node carries aria-current="step" — the current state (Review).
    const current = items.filter((el) => el.getAttribute("aria-current") === "step");
    expect(current).toHaveLength(1);
    expect(current[0].textContent).toContain("Review");
  });

  it("renders gracefully when currentState matches no state (findIndex -1)", async () => {
    const { WorkflowProgressBlock } = await import("@/base/blocks/WorkflowProgressBlock");
    const data = { ...workflowProgressData(), currentState: "archived" };
    const descriptor = block("workflow_progress", "test-workflow-unknown", data);
    render(<WorkflowProgressBlock block={descriptor} />);

    // All labels still render, no node is marked current — "not started".
    expect(screen.getByText("Draft")).toBeDefined();
    expect(screen.getByText("Published")).toBeDefined();
    const current = screen
      .getAllByRole("listitem")
      .filter((el) => el.getAttribute("aria-current") === "step");
    expect(current).toHaveLength(0);
  });
});

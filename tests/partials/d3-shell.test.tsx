import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import "../setup";

import { QuickRecordSheet } from "@/base/partials/QuickRecordSheet";
import { ResizableSidebar } from "@/base/partials/ResizableSidebar";

describe("ResizableSidebar", () => {
  afterEach(() => cleanup());

  it("renders both main and aside content", () => {
    render(
      <ResizableSidebar aside={<p>Aside panel</p>}>
        <p>Main content</p>
      </ResizableSidebar>,
    );
    expect(screen.getByText("Main content")).toBeDefined();
    expect(screen.getByText("Aside panel")).toBeDefined();
  });
});

describe("QuickRecordSheet", () => {
  afterEach(() => cleanup());

  it("renders title, description and body when open", () => {
    render(
      <QuickRecordSheet open onOpenChange={() => {}} title="New record" description="Fill the form">
        <p>Form body</p>
      </QuickRecordSheet>,
    );
    expect(screen.getByText("New record")).toBeDefined();
    expect(screen.getByText("Fill the form")).toBeDefined();
    expect(screen.getByText("Form body")).toBeDefined();
  });

  it("does not render the body when closed", () => {
    render(
      <QuickRecordSheet open={false} onOpenChange={() => {}} title="Hidden">
        <p>Hidden body</p>
      </QuickRecordSheet>,
    );
    expect(screen.queryByText("Hidden body")).toBeNull();
  });
});

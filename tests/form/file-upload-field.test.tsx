import type { ReactElement } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import "../setup";

import { FileUploadField } from "@/base/form/fields/FileUploadField";
import { I18nProvider } from "@/i18n/I18nProvider";

function wrap(ui: ReactElement) {
  return render(<I18nProvider>{ui}</I18nProvider>);
}

const noop = () => {};

describe("FileUploadField controlled value (F-23)", () => {
  afterEach(() => cleanup());

  it("shows an existing file from an object value (edit mode)", () => {
    wrap(
      <FileUploadField
        id="avatar"
        value={{
          name: "resume.pdf",
          size: 2048,
          type: "application/pdf",
          url: "/files/resume.pdf",
          id: "f1",
        }}
        onChange={noop}
      />,
    );
    expect(screen.getByText("resume.pdf")).toBeInTheDocument();
  });

  it("derives the display name from a plain URL string value", () => {
    wrap(<FileUploadField id="photo" value="/uploads/2026/photo.png" onChange={noop} />);
    expect(screen.getByText("photo.png")).toBeInTheDocument();
  });

  it("shows all existing files from an array value when multiple", () => {
    wrap(
      <FileUploadField
        id="docs"
        multiple
        value={[
          { name: "a.pdf", url: "/a.pdf", id: "a" },
          { name: "b.pdf", url: "/b.pdf", id: "b" },
        ]}
        onChange={noop}
      />,
    );
    expect(screen.getByText("a.pdf")).toBeInTheDocument();
    expect(screen.getByText("b.pdf")).toBeInTheDocument();
  });

  it("emits null when an existing single file is removed", () => {
    const onChange = vi.fn();
    wrap(
      <FileUploadField
        id="avatar"
        value={{ name: "resume.pdf", url: "/files/resume.pdf", id: "f1" }}
        onChange={onChange}
      />,
    );
    // Single-file mode in the file-list state renders exactly one control: remove.
    fireEvent.click(screen.getByRole("button"));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("renders the empty state (no existing files) for a null value", () => {
    wrap(<FileUploadField id="empty" value={null} onChange={noop} />);
    expect(screen.queryByText("resume.pdf")).toBeNull();
    // Empty state exposes only the browse control (no per-file remove buttons).
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  // ── Locked behavior: multi-file edit-mode residual (see ADR-F23-multifile) ──
  // onChange only reports new browser File instances; existing FileMetadata is
  // filtered out. So removing one existing file from a multi-file list drops the
  // kept existing refs and emits []. This test LOCKS that known limitation: any
  // future fix toward a structured payload must update it deliberately.
  it("LOCKED: removing one existing file in multi-mode emits [] (kept refs dropped)", () => {
    const onChange = vi.fn();
    wrap(
      <FileUploadField
        id="docs"
        multiple
        value={[
          { name: "a.pdf", url: "/a.pdf", id: "a" },
          { name: "b.pdf", url: "/b.pdf", id: "b" },
        ]}
        onChange={onChange}
      />,
    );

    // Buttons render in DOM order: [remove a.pdf, remove b.pdf, add-more].
    // Click the first remove (a.pdf).
    fireEvent.click(screen.getAllByRole("button")[0]);

    // b.pdf is still displayed, but it is FileMetadata so it is filtered out of
    // the emitted value — the residual documented in ADR-F23-multifile.
    expect(screen.getByText("b.pdf")).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith([]);
  });
});

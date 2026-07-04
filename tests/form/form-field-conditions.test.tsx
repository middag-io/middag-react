import type { ReactElement } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import "../setup";

import { FormField } from "@/base/form/FormField";
import type { FormFieldNode } from "@/contracts/block-data";
import { I18nProvider } from "@/i18n/I18nProvider";

function wrap(ui: ReactElement) {
  return render(<I18nProvider>{ui}</I18nProvider>);
}

const noop = () => {};

describe("FormField conditional state (disabled_when / required_when)", () => {
  afterEach(() => cleanup());

  it("disables the input when disabled_when matches sibling values", () => {
    const field: FormFieldNode = {
      kind: "field",
      key: "note",
      component: "text",
      props: { label: "Note", disabled_when: { field: "mode", operator: "equals", value: "auto" } },
    };
    wrap(<FormField field={field} value="" onChange={noop} sourceValues={{ mode: "auto" }} />);
    expect(screen.getByLabelText("Note")).toBeDisabled();
  });

  it("keeps the input enabled when disabled_when does not match", () => {
    const field: FormFieldNode = {
      kind: "field",
      key: "note",
      component: "text",
      props: { label: "Note", disabled_when: { field: "mode", operator: "equals", value: "auto" } },
    };
    wrap(<FormField field={field} value="" onChange={noop} sourceValues={{ mode: "manual" }} />);
    expect(screen.getByLabelText("Note")).not.toBeDisabled();
  });

  it("marks the input required when required_when matches", () => {
    const field: FormFieldNode = {
      kind: "field",
      key: "reason",
      component: "text",
      props: {
        label: "Reason",
        required_when: { field: "type", operator: "equals", value: "other" },
      },
    };
    wrap(<FormField field={field} value="" onChange={noop} sourceValues={{ type: "other" }} />);
    expect(screen.getByLabelText(/Reason/)).toHaveAttribute("aria-required", "true");
  });

  it("does not mark required when required_when does not match", () => {
    const field: FormFieldNode = {
      kind: "field",
      key: "reason",
      component: "text",
      props: {
        label: "Reason",
        required_when: { field: "type", operator: "equals", value: "other" },
      },
    };
    wrap(<FormField field={field} value="" onChange={noop} sourceValues={{ type: "standard" }} />);
    expect(screen.getByLabelText("Reason")).not.toHaveAttribute("aria-required");
  });

  it("suppresses the required marker when the field is also disabled", () => {
    const field: FormFieldNode = {
      kind: "field",
      key: "note",
      component: "text",
      props: {
        label: "Note",
        required: true,
        disabled_when: { field: "mode", operator: "equals", value: "auto" },
      },
    };
    wrap(<FormField field={field} value="" onChange={noop} sourceValues={{ mode: "auto" }} />);
    const input = screen.getByLabelText("Note");
    expect(input).toBeDisabled();
    expect(input).not.toHaveAttribute("aria-required");
  });
});

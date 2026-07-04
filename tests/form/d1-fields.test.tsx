import type { ReactElement } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import "../setup";

import { DateRangeField } from "@/base/form/fields/DateRangeField";
import { NativeSelectField } from "@/base/form/fields/NativeSelectField";
import { OtpField } from "@/base/form/fields/OtpField";
import { RatingField } from "@/base/form/fields/RatingField";
import { SliderField } from "@/base/form/fields/SliderField";
import { I18nProvider } from "@/i18n/I18nProvider";

function wrap(ui: ReactElement) {
  return render(<I18nProvider>{ui}</I18nProvider>);
}

describe("SliderField", () => {
  afterEach(() => cleanup());

  it("renders one thumb and the current value in single mode", () => {
    wrap(<SliderField id="vol" value={30} onChange={() => {}} min={0} max={100} />);
    expect(screen.getAllByRole("slider")).toHaveLength(1);
    expect(screen.getByText("30")).toBeDefined();
  });

  it("renders two thumbs and a range display in multiple mode", () => {
    wrap(<SliderField id="rng" value={[20, 80]} onChange={() => {}} multiple />);
    expect(screen.getAllByRole("slider")).toHaveLength(2);
    expect(screen.getByText("20 – 80")).toBeDefined();
  });
});

describe("OtpField", () => {
  afterEach(() => cleanup());

  it("renders maxLength slots and reports the typed value", () => {
    const onChange = vi.fn();
    const { container } = wrap(<OtpField id="otp" value="" onChange={onChange} maxLength={6} />);
    expect(container.querySelectorAll('[data-slot="input-otp-slot"]')).toHaveLength(6);
    const input = container.querySelector("input");
    fireEvent.change(input!, { target: { value: "123456" } });
    expect(onChange).toHaveBeenCalledWith("123456");
  });

  it("inserts a separator when groupSize splits the slots", () => {
    const { container } = wrap(
      <OtpField id="otp2" value="" onChange={() => {}} maxLength={6} groupSize={3} />,
    );
    expect(container.querySelectorAll('[data-slot="input-otp-separator"]')).toHaveLength(1);
  });
});

describe("NativeSelectField", () => {
  afterEach(() => cleanup());

  const options = [
    { value: "a", label: "Alpha" },
    { value: "b", label: "Beta" },
  ];

  it("renders options and fires onChange with the selected value", () => {
    const onChange = vi.fn();
    wrap(<NativeSelectField id="sel" value="" onChange={onChange} options={options} />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "b" } });
    expect(onChange).toHaveBeenCalledWith("b");
    expect(screen.getByRole("option", { name: "Alpha" })).toBeDefined();
  });

  it("exposes aria-required when required (F-32)", () => {
    wrap(<NativeSelectField id="sel-req" value="" onChange={vi.fn()} options={options} required />);
    expect(screen.getByRole("combobox").getAttribute("aria-required")).toBe("true");
  });

  it("omits aria-required when not required (F-32)", () => {
    wrap(<NativeSelectField id="sel-opt" value="" onChange={vi.fn()} options={options} />);
    expect(screen.getByRole("combobox").getAttribute("aria-required")).toBeNull();
  });
});

describe("RatingField (F-32)", () => {
  afterEach(() => cleanup());

  it("marks the radiogroup aria-required when required", () => {
    wrap(<RatingField id="rate" value={null} onChange={vi.fn()} required />);
    expect(screen.getByRole("radiogroup").getAttribute("aria-required")).toBe("true");
  });
});

describe("DateRangeField (F-32)", () => {
  afterEach(() => cleanup());

  it("marks the wrapper aria-required when required", () => {
    const { container } = wrap(
      <DateRangeField id="range" value={undefined} onChange={vi.fn()} required />,
    );
    expect(container.querySelector("#range")?.getAttribute("aria-required")).toBe("true");
  });
});

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import "../setup";

import { ToggleGroupControl, type ToggleGroupOption } from "@/base/partials/ToggleGroupControl";
import { I18nProvider } from "@/i18n/I18nProvider";

const options: ToggleGroupOption[] = [
  { value: "grid", label: "Grid" },
  { value: "list", label: "List" },
  { value: "kanban", label: "Kanban", disabled: true },
];

describe("ToggleGroupControl", () => {
  afterEach(() => cleanup());

  it("renders one toggle per option", () => {
    render(
      <I18nProvider>
        <ToggleGroupControl options={options} />
      </I18nProvider>,
    );
    expect(screen.getByText("Grid")).toBeDefined();
    expect(screen.getByText("List")).toBeDefined();
    expect(screen.getByText("Kanban")).toBeDefined();
  });

  it("labels the group with the default translated aria-label", () => {
    render(
      <I18nProvider>
        <ToggleGroupControl options={options} />
      </I18nProvider>,
    );
    expect(screen.getByRole("group").getAttribute("aria-label")).toBe("Options");
  });

  it("honours an explicit ariaLabel override", () => {
    render(
      <I18nProvider>
        <ToggleGroupControl options={options} ariaLabel="View mode" />
      </I18nProvider>,
    );
    expect(screen.getByRole("group").getAttribute("aria-label")).toBe("View mode");
  });

  it("fires onValueChange with the selected value (single)", () => {
    const onValueChange = vi.fn();
    render(
      <I18nProvider>
        <ToggleGroupControl options={options} onValueChange={onValueChange} />
      </I18nProvider>,
    );
    fireEvent.click(screen.getByText("List"));
    expect(onValueChange).toHaveBeenCalledWith("list");
  });

  it("supports multiple selection mode", () => {
    const onValueChange = vi.fn();
    render(
      <I18nProvider>
        <ToggleGroupControl
          type="multiple"
          options={options}
          defaultValue={["grid"]}
          onValueChange={onValueChange}
        />
      </I18nProvider>,
    );
    fireEvent.click(screen.getByText("List"));
    expect(onValueChange).toHaveBeenCalledWith(["grid", "list"]);
  });
});

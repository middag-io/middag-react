import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import "../setup";

import {
  registerFieldComponent,
  type FieldComponentProps,
} from "@/base/form/fields/field-registry";
import { TextField } from "@/base/form/fields/TextField";
import { FormField } from "@/base/form/FormField";
import { I18nProvider } from "@/i18n/I18nProvider";

/** A field the router has never heard of, reading its own props from the bag. */
function StarPicker({ value, onChange, fieldProps }: FieldComponentProps) {
  const stars = Number(fieldProps.stars ?? 0);
  return (
    <div>
      <output data-testid="picked">{String(value ?? "")}</output>
      {Array.from({ length: stars }, (_, i) => (
        <button key={i} type="button" onClick={() => onChange(String(i + 1))}>
          {`star-${i + 1}`}
        </button>
      ))}
    </div>
  );
}

describe("field registry", () => {
  afterEach(() => cleanup());

  it("renders a registered field component the built-in switch does not know", () => {
    registerFieldComponent("star_picker", StarPicker);

    render(
      <I18nProvider>
        <FormField
          field={{
            kind: "field",
            key: "rank",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- a type the union deliberately does not contain
            component: "star_picker" as any,
            props: { label: "Rank", stars: 3 } as never,
          }}
          value=""
          onChange={() => {}}
        />
      </I18nProvider>,
    );

    // The label wrapper still comes from the router; the input is the custom one.
    expect(screen.getByText("Rank")).toBeDefined();
    expect(screen.getByText("star-3")).toBeDefined();
  });

  it("passes the value through and reports changes back", () => {
    registerFieldComponent("star_picker", StarPicker);
    const seen: unknown[] = [];

    render(
      <I18nProvider>
        <FormField
          field={{
            kind: "field",
            key: "rank",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- see above
            component: "star_picker" as any,
            props: { label: "Rank", stars: 2 } as never,
          }}
          value="1"
          onChange={(v) => seen.push(v)}
        />
      </I18nProvider>,
    );

    expect(screen.getByTestId("picked").textContent).toBe("1");
    fireEvent.click(screen.getByText("star-2"));
    expect(seen).toEqual(["2"]);
  });

  it("leaves built-in components to the switch", () => {
    // The registry holds the shipped fields too, and those expect their own
    // explicit props rather than the `fieldProps` bag. So the lookup happens only
    // for a component the switch does not recognise — registering over `text`
    // must NOT take effect, or every form in the library would break.
    registerFieldComponent("text", () => <span>replaced</span>);

    render(
      <I18nProvider>
        <FormField
          field={{ kind: "field", key: "name", component: "text", props: { label: "Name" } }}
          value=""
          onChange={() => {}}
        />
      </I18nProvider>,
    );

    expect(screen.queryByText("replaced")).toBeNull();
    expect(screen.getByRole("textbox")).toBeDefined();

    registerFieldComponent("text", TextField);
  });
});

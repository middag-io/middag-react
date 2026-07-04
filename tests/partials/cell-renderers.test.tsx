import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import "../setup";

import {
  AnnotatedCell,
  BooleanCell,
  HtmlCell,
  LinkCell,
  LinkGroupCell,
  ProgressCell,
  RichStatusCell,
  StatusCell,
  TimestampCell,
} from "@/base/partials/DataTable/cell-renderers";
import { I18nProvider } from "@/i18n/I18nProvider";

const column = { key: "progress" };

function renderCell(value: unknown) {
  return render(<ProgressCell value={value} row={{}} column={column} />);
}

describe("ProgressCell", () => {
  afterEach(() => cleanup());

  it("renders a bare number as a percentage out of 100", () => {
    renderCell(75);
    const bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-valuenow")).toBe("75");
    expect(screen.getByText("75%")).toBeDefined();
  });

  it("computes the percentage from value/max for a structured value", () => {
    renderCell({ value: 3, max: 4 });
    const bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-valuenow")).toBe("75");
    expect(screen.getByText("75%")).toBeDefined();
  });

  it("honors a custom label over the computed percentage", () => {
    renderCell({ value: 50, label: "halfway" });
    expect(screen.getByText("halfway")).toBeDefined();
    expect(screen.queryByText("50%")).toBeNull();
  });

  it("clamps values above the maximum to 100", () => {
    renderCell({ value: 150 });
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("100");
  });

  it("clamps negative values to 0", () => {
    renderCell({ value: -20 });
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("0");
  });

  it("applies the semantic bar color from appearance", () => {
    const { container } = renderCell({ value: 40, appearance: "success" });
    expect(container.querySelector(".bg-success")).not.toBeNull();
  });

  it("renders an em dash for null", () => {
    renderCell(null);
    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(screen.getByText("—")).toBeDefined();
  });

  it("renders an em dash for non-numeric junk", () => {
    renderCell("not-a-number");
    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(screen.getByText("—")).toBeDefined();
  });

  it("renders an em dash for arrays (not coerced via Number)", () => {
    renderCell([75]);
    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(screen.getByText("—")).toBeDefined();
  });

  it("treats max<=0 as 100 instead of dividing by zero", () => {
    renderCell({ value: 5, max: 0 });
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("5");
  });
});

describe("TimestampCell", () => {
  afterEach(() => cleanup());

  // 2020-06-15T12:00:00Z in Unix seconds.
  const PAST_TS = Math.floor(Date.UTC(2020, 5, 15, 12, 0, 0) / 1000);

  function renderTs(value: unknown, timestampFormat?: string) {
    return render(
      <I18nProvider>
        <TimestampCell
          value={value}
          row={{}}
          column={{ key: "ts", timestampFormat: timestampFormat as never }}
        />
      </I18nProvider>,
    );
  }

  it("renders the ISO format when column.timestampFormat is 'iso'", () => {
    renderTs(PAST_TS, "iso");
    expect(screen.getByText("2020-06-15T12:00:00.000Z")).toBeDefined();
  });

  it("renders an absolute date when format is 'date'", () => {
    renderTs(PAST_TS, "date");
    // Locale "en" from the test usePage mock → medium date contains the year.
    expect(screen.getByText(/2020/)).toBeDefined();
  });

  it("defaults to the relative/hybrid scale for old timestamps", () => {
    renderTs(PAST_TS);
    expect(screen.getByText(/2020/)).toBeDefined();
  });

  it("renders an em dash for null", () => {
    renderTs(null);
    expect(screen.getByText("—")).toBeDefined();
  });
});

describe("StatusCell", () => {
  afterEach(() => cleanup());

  it("renders the status string as a pill", () => {
    render(<StatusCell value="active" row={{}} column={{ key: "status" }} />);
    expect(screen.getByText("active")).toBeDefined();
  });

  it("renders an em dash for null", () => {
    render(<StatusCell value={null} row={{}} column={{ key: "status" }} />);
    expect(screen.getByText("—")).toBeDefined();
  });
});

describe("BooleanCell", () => {
  afterEach(() => cleanup());

  it("renders a success icon for true and a muted icon for false", () => {
    const { container: t } = render(<BooleanCell value={true} row={{}} column={{ key: "ok" }} />);
    expect(t.querySelector(".text-success")).not.toBeNull();
    cleanup();
    const { container: f } = render(<BooleanCell value={false} row={{}} column={{ key: "ok" }} />);
    expect(f.querySelector(".text-success")).toBeNull();
    expect(f.querySelector(".text-muted-foreground")).not.toBeNull();
  });

  it("renders an em dash for null", () => {
    render(<BooleanCell value={null} row={{}} column={{ key: "ok" }} />);
    expect(screen.getByText("—")).toBeDefined();
  });
});

describe("LinkCell", () => {
  afterEach(() => cleanup());

  it("interpolates the href template with row values", () => {
    render(
      <LinkCell value="Item 7" row={{ id: 7 }} column={{ key: "name", href: "/items/{id}" }} />,
    );
    const link = screen.getByRole("link", { name: "Item 7" });
    expect(link.getAttribute("href")).toBe("/items/7");
  });

  it("renders plain text when no href or entity mapping is present", () => {
    render(<LinkCell value="Plain" row={{}} column={{ key: "name" }} />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText("Plain")).toBeDefined();
  });

  it("renders an em dash for null", () => {
    render(<LinkCell value={null} row={{}} column={{ key: "name" }} />);
    expect(screen.getByText("—")).toBeDefined();
  });
});

describe("RichStatusCell", () => {
  afterEach(() => cleanup());

  it("renders the label from a structured status value", () => {
    render(
      <RichStatusCell
        value={{ label: "Connected", appearance: "success" }}
        row={{}}
        column={{ key: "s" }}
      />,
    );
    expect(screen.getByText("Connected")).toBeDefined();
  });
});

describe("HtmlCell", () => {
  afterEach(() => cleanup());

  it("renders provided HTML markup", () => {
    const { container } = render(
      <HtmlCell value="<strong>bold</strong>" row={{}} column={{ key: "h" }} />,
    );
    expect(container.querySelector("strong")?.textContent).toBe("bold");
  });

  it("renders an em dash for an empty string", () => {
    render(<HtmlCell value="" row={{}} column={{ key: "h" }} />);
    expect(screen.getByText("—")).toBeDefined();
  });
});

describe("LinkGroupCell", () => {
  afterEach(() => cleanup());

  it("renders only items that have an href", () => {
    render(
      <LinkGroupCell
        value={[
          { label: "Edit", icon: "pencil", href: "/edit" },
          { label: "NoLink", icon: "x", href: null },
        ]}
        row={{}}
        column={{ key: "actions" }}
      />,
    );
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute("href")).toBe("/edit");
  });

  it("renders an em dash for an empty array", () => {
    render(<LinkGroupCell value={[]} row={{}} column={{ key: "actions" }} />);
    expect(screen.getByText("—")).toBeDefined();
  });
});

describe("AnnotatedCell", () => {
  afterEach(() => cleanup());

  it("renders a bare string value as plain text", () => {
    render(<AnnotatedCell value="just text" row={{}} column={{ key: "a" }} />);
    expect(screen.getByText("just text")).toBeDefined();
  });

  it("renders an em dash for null", () => {
    render(<AnnotatedCell value={null} row={{}} column={{ key: "a" }} />);
    expect(screen.getByText("—")).toBeDefined();
  });
});

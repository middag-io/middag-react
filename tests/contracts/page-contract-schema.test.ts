import { describe, expect, it } from "vitest";

import { validatePageContract } from "@/contracts/page-contract-schema";

// ---------------------------------------------------------------------------
// Fixture
// ---------------------------------------------------------------------------

const validContract = {
  version: "1" as const,
  shell: "product" as const,
  page: { key: "test", title: "Test Page" },
  layout: {
    template: "stack" as const,
    regions: {
      content: [
        {
          type: "metric_card",
          key: "m1",
          data: { value: "42", label: "Test" },
        },
      ],
    },
  },
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("validatePageContract", () => {
  it("returns null for a valid contract", () => {
    expect(validatePageContract(validContract)).toBeNull();
  });

  it("returns errors when version is missing", () => {
    const { version: _, ...contract } = validContract;
    void _;
    const errors = validatePageContract(contract);

    expect(errors).not.toBeNull();
    expect(errors!.length).toBeGreaterThan(0);
  });

  it("returns errors when layout is missing", () => {
    const { layout: _, ...contract } = validContract;
    void _;
    const errors = validatePageContract(contract);

    expect(errors).not.toBeNull();
    expect(errors!.length).toBeGreaterThan(0);
  });

  it("returns errors when page is missing", () => {
    const { page: _, ...contract } = validContract;
    void _;
    const errors = validatePageContract(contract);

    expect(errors).not.toBeNull();
    expect(errors!.length).toBeGreaterThan(0);
  });

  it('returns errors for wrong version ("2" instead of "1")', () => {
    const contract = { ...validContract, version: "2" };
    const errors = validatePageContract(contract);

    expect(errors).not.toBeNull();
    expect(errors!.some((e) => e.field === "version")).toBe(true);
  });

  it("allows extra fields (forward compat — Zod strips by default)", () => {
    const contract = {
      ...validContract,
      futureField: "something",
      anotherFutureField: 42,
    };
    expect(validatePageContract(contract)).toBeNull();
  });

  it("accepts custom shell types (extensible)", () => {
    const contract = { ...validContract, shell: "marketplace" };
    expect(validatePageContract(contract)).toBeNull();
  });

  it("accepts custom layout templates (extensible)", () => {
    const contract = {
      ...validContract,
      layout: { ...validContract.layout, template: "kanban" },
    };
    expect(validatePageContract(contract)).toBeNull();
  });

  it("returns errors for an empty object", () => {
    const errors = validatePageContract({});

    expect(errors).not.toBeNull();
    expect(errors!.length).toBeGreaterThan(0);
  });
});

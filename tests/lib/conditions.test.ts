import { describe, expect, it } from "vitest";

import { evaluateCondition } from "@/base/utils/conditions";

describe("evaluateCondition", () => {
  it("matches boolean values against string wire values", () => {
    expect(
      evaluateCondition(
        { field: "email_notifications", operator: "equals", value: "true" },
        { email_notifications: true },
      ),
    ).toBe(true);
  });

  it("matches numeric values against string wire values", () => {
    expect(
      evaluateCondition({ field: "count", operator: "equals", value: "3" }, { count: 3 }),
    ).toBe(true);
  });
});

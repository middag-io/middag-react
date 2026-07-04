import { afterEach, describe, expect, it } from "vitest";

import { getHostStringResolver, setHostStringResolver } from "@/i18n/host-resolver";

afterEach(() => setHostStringResolver(null));

describe("host-resolver", () => {
  it("is null until set", () => {
    expect(getHostStringResolver()).toBeNull();
  });

  it("stores and clears the resolver", () => {
    const fn = async () => "x";
    setHostStringResolver(fn);
    expect(getHostStringResolver()).toBe(fn);
    setHostStringResolver(null);
    expect(getHostStringResolver()).toBeNull();
  });
});

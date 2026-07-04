import { describe, expect, it } from "vitest";

import {
  formatDateGroupLabel,
  formatISO,
  formatRelativeTime,
  formatTimestamp,
} from "@/base/utils/time";

// Fixed Unix timestamp (seconds): 2020-06-15T12:00:00Z — far enough in the past
// that the relative scale always lands on the absolute "day month year" branch.
const PAST_TS = Math.floor(Date.UTC(2020, 5, 15, 12, 0, 0) / 1000);
const nowTs = () => Math.floor(Date.now() / 1000);

describe("formatISO", () => {
  it("returns ISO 8601 from a Unix timestamp", () => {
    expect(formatISO(PAST_TS)).toBe("2020-06-15T12:00:00.000Z");
  });

  it("returns empty string instead of throwing for NaN", () => {
    expect(formatISO(NaN)).toBe("");
  });
});

describe("formatTimestamp", () => {
  it("renders the iso format exactly, ignoring locale", () => {
    expect(formatTimestamp(PAST_TS, "iso", "pt-BR")).toBe("2020-06-15T12:00:00.000Z");
  });

  it("renders an absolute date containing the year", () => {
    expect(formatTimestamp(PAST_TS, "date", "en-US")).toContain("2020");
  });

  it("renders datetime containing the year", () => {
    expect(formatTimestamp(PAST_TS, "datetime", "en-US")).toContain("2020");
  });

  it("renders a non-empty time-of-day string", () => {
    expect(formatTimestamp(PAST_TS, "time", "en-US").length).toBeGreaterThan(0);
  });

  it("threads the locale (en and pt-BR produce different date text)", () => {
    const en = formatTimestamp(PAST_TS, "date", "en-US");
    const pt = formatTimestamp(PAST_TS, "date", "pt-BR");
    expect(en).not.toBe(pt);
  });

  it("defaults to the relative format", () => {
    expect(formatTimestamp(PAST_TS, undefined, "en")).toBe(formatRelativeTime(PAST_TS, "en"));
  });
});

describe("formatRelativeTime", () => {
  it("localizes 'now' for the current instant", () => {
    expect(formatRelativeTime(nowTs(), "en")).toBe("now");
    expect(formatRelativeTime(nowTs(), "pt-BR")).toBe("agora");
  });

  it("localizes 'minutes ago' within the hour", () => {
    const fiveMinAgo = nowTs() - 5 * 60;
    expect(formatRelativeTime(fiveMinAgo, "en")).toContain("ago");
    expect(formatRelativeTime(fiveMinAgo, "pt-BR")).toContain("há");
  });

  it("falls back to an absolute date with year for old timestamps", () => {
    expect(formatRelativeTime(PAST_TS, "en")).toContain("2020");
  });

  it("defaults to the 'en' locale when none is passed", () => {
    expect(formatRelativeTime(nowTs())).toBe("now");
  });
});

describe("invalid timestamps", () => {
  it("returns empty string instead of throwing for NaN", () => {
    expect(formatRelativeTime(NaN, "en")).toBe("");
    expect(formatTimestamp(NaN, "iso", "en")).toBe("");
    expect(formatDateGroupLabel(NaN, "en")).toBe("");
  });
});

describe("formatDateGroupLabel", () => {
  it("localizes 'today' for the current day", () => {
    expect(formatDateGroupLabel(nowTs(), "en")).toBe("today");
    expect(formatDateGroupLabel(nowTs(), "pt-BR")).toBe("hoje");
  });

  it("returns an absolute date with year for old timestamps", () => {
    expect(formatDateGroupLabel(PAST_TS, "en")).toContain("2020");
  });
});

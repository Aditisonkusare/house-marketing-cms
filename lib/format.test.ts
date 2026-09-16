import { describe, it, expect } from "vitest";
import { formatCurrency, formatArea, formatDate } from "@/lib/format";

describe("formatCurrency", () => {
  it("formats a whole euro amount with thousands separators and no decimals", () => {
    expect(formatCurrency(385000)).toBe("€385,000");
  });
});

describe("formatArea", () => {
  it("formats a floor area with the m² suffix", () => {
    expect(formatArea(110)).toBe("110 m²");
  });
});

describe("formatDate", () => {
  it("formats a date as day, full month name, and year", () => {
    expect(formatDate(new Date("2026-09-16T00:00:00Z"))).toBe("16 September 2026");
  });

  it("accepts an ISO date string as well as a Date object", () => {
    expect(formatDate("2026-09-16T00:00:00Z")).toBe("16 September 2026");
  });
});

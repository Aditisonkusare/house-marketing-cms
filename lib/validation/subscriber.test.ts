import { describe, it, expect } from "vitest";
import { registerSubscriberSchema } from "@/lib/validation/subscriber";

describe("registerSubscriberSchema", () => {
  it("accepts a valid registration", () => {
    const result = registerSubscriberSchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      consent: true,
    });

    expect(result.success).toBe(true);
  });

  it("rejects an empty name", () => {
    const result = registerSubscriberSchema.safeParse({
      name: "",
      email: "alice@example.com",
      consent: true,
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid email address", () => {
    const result = registerSubscriberSchema.safeParse({
      name: "Alice",
      email: "not-an-email",
      consent: true,
    });

    expect(result.success).toBe(false);
  });

  it("rejects registration when consent is not explicitly true", () => {
    const result = registerSubscriberSchema.safeParse({
      name: "Alice",
      email: "alice@example.com",
      consent: false,
    });

    expect(result.success).toBe(false);
  });

  it("trims the name and normalizes the email to lowercase", () => {
    const result = registerSubscriberSchema.safeParse({
      name: "  Alice  ",
      email: "  ALICE@Example.com  ",
      consent: true,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Alice");
      expect(result.data.email).toBe("alice@example.com");
    }
  });
});

import { describe, it, expect } from "vitest";
import { generateOtp } from "../src/utils/generateOtp";

describe("generateOtp", () => {
  it("returns a 6-character string", () => {
    for (let i = 0; i < 100; i++) {
      const otp = generateOtp();
      expect(typeof otp).toBe("string");
      expect(otp).toHaveLength(6);
    }
  });

  it("contains only digits", () => {
    for (let i = 0; i < 100; i++) {
      expect(generateOtp()).toMatch(/^\d{6}$/);
    }
  });

  it("stays within the 100000–999999 range", () => {
    for (let i = 0; i < 1000; i++) {
      const value = parseInt(generateOtp(), 10);
      expect(value).toBeGreaterThanOrEqual(100000);
      expect(value).toBeLessThanOrEqual(999999);
    }
  });
});

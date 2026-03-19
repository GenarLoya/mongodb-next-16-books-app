import { describe, it, expect } from "vitest";
import { BorrowBookDto } from "../borrow.dto";

describe("BorrowBookDto", () => {
  it("should pass with valid userId", () => {
    const result = BorrowBookDto.safeParse({
      userId: "user123",
    });

    expect(result.success).toBe(true);
  });

  it("should fail if userId is missing", () => {
    const result = BorrowBookDto.safeParse({});

    expect(result.success).toBe(false);
  });

  it("should fail if userId is not a string", () => {
    const result = BorrowBookDto.safeParse({
      userId: 123,
    });

    expect(result.success).toBe(false);
  });

  // ⚠️ string vacío (comportamiento actual)
  it("should not allow empty string", () => {
    const result = BorrowBookDto.safeParse({
      userId: "",
    });

    expect(result.success).toBe(false);
  });
});

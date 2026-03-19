import { describe, it, expect } from "vitest";
import { EditBookDto } from "../editBook.dto";

describe("EditBookDto", () => {
  it("should pass with only title", () => {
    const result = EditBookDto.safeParse({
      title: "New Title",
    });

    expect(result.success).toBe(true);
  });

  it("should pass with only author", () => {
    const result = EditBookDto.safeParse({
      author: "New Author",
    });

    expect(result.success).toBe(true);
  });

  it("should pass with both fields", () => {
    const result = EditBookDto.safeParse({
      title: "Book",
      author: "Author",
    });

    expect(result.success).toBe(true);
  });

  it("should pass with empty object", () => {
    const result = EditBookDto.safeParse({});

    expect(result.success).toBe(true);
  });

  it("should fail if title is not a string", () => {
    const result = EditBookDto.safeParse({
      title: 123,
    });

    expect(result.success).toBe(false);
  });

  it("should fail if author is not a string", () => {
    const result = EditBookDto.safeParse({
      author: 123,
    });

    expect(result.success).toBe(false);
  });

  it("should not allow empty strings", () => {
    const result = EditBookDto.safeParse({
      title: "",
      author: "",
    });

    expect(result.success).toBe(false);
  });
});

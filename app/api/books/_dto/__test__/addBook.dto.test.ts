import { describe, it, expect } from "vitest";
import { AddBookDto } from "../addBook.dto";

describe("AddBookDto", () => {
  it("should pass with valid data", () => {
    const result = AddBookDto.safeParse({
      title: "Clean Code",
      author: "Robert C. Martin",
    });

    expect(result.success).toBe(true);
  });

  it("should fail if title is missing", () => {
    const result = AddBookDto.safeParse({
      author: "Author",
    });

    expect(result.success).toBe(false);
  });

  it("should fail if author is missing", () => {
    const result = AddBookDto.safeParse({
      title: "Book",
    });

    expect(result.success).toBe(false);
  });

  it("should fail if all fields are missing", () => {
    const result = AddBookDto.safeParse({});

    expect(result.success).toBe(false);
  });

  it("should not allow empty strings", () => {
    const result = AddBookDto.safeParse({
      title: "",
      author: "",
    });

    expect(result.success).toBe(false);
  });

  it("should fail if title is not a string", () => {
    const result = AddBookDto.safeParse({
      title: 123,
      author: "Author",
    });

    expect(result.success).toBe(false);
  });

  it("should fail if author is not a string", () => {
    const result = AddBookDto.safeParse({
      title: "Book",
      author: 123,
    });

    expect(result.success).toBe(false);
  });
});

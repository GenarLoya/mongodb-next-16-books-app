import { describe, it, expect } from "vitest";
import { BookSearchParamsDto } from "../searchParams.dto";

describe("BookSearchParamsDto", () => {
  it("should apply default values", () => {
    const result = BookSearchParamsDto.parse({});

    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.sort_by).toBe("createdAt");
    expect(result.order).toBe("desc");
  });

  it("should coerce page and limit from string", () => {
    const result = BookSearchParamsDto.parse({
      page: "2",
      limit: "20",
    });

    expect(result.page).toBe(2);
    expect(result.limit).toBe(20);
  });

  it("should fail if page is less than 1", () => {
    const result = BookSearchParamsDto.safeParse({
      page: 0,
    });

    expect(result.success).toBe(false);
  });

  it("should fail if limit is greater than 100", () => {
    const result = BookSearchParamsDto.safeParse({
      limit: 101,
    });

    expect(result.success).toBe(false);
  });

  it("should coerce is_available from string", () => {
    const result = BookSearchParamsDto.parse({
      is_available: "true",
    });

    expect(result.is_available).toBe(true);
  });

  it("should coerce 'false' string correctly", () => {
    const result = BookSearchParamsDto.parse({
      is_available: "false",
    });

    expect(result.is_available).toBe(false);
  });

  it("should coerce dates correctly", () => {
    const result = BookSearchParamsDto.parse({
      created_from: "2024-01-01",
      created_to: "2024-12-31",
    });

    expect(result.created_from).toBeInstanceOf(Date);
    expect(result.created_to).toBeInstanceOf(Date);
  });

  it("should fail with invalid date", () => {
    const result = BookSearchParamsDto.safeParse({
      created_from: "not-a-date",
    });

    expect(result.success).toBe(false);
  });

  it("should accept valid sort and order", () => {
    const result = BookSearchParamsDto.parse({
      sort_by: "title",
      order: "asc",
    });

    expect(result.sort_by).toBe("title");
    expect(result.order).toBe("asc");
  });

  it("should fail with invalid sort_by", () => {
    const result = BookSearchParamsDto.safeParse({
      sort_by: "invalid",
    });

    expect(result.success).toBe(false);
  });

  it("should accept multiple filters", () => {
    const result = BookSearchParamsDto.parse({
      q: "harry",
      author: "rowling",
      library_id: "123",
      borrowed_by: "456",
    });

    expect(result.q).toBe("harry");
    expect(result.author).toBe("rowling");
  });
});

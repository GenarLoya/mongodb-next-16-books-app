import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchByFilters } from "../searchByFilters.service";
import Book, { IBook } from "@/models/Book";
import { TBookSearchParamsDto } from "../../_dto/searchParams.dto";

vi.mock("@/models/Book");

describe("searchByFilters service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockQueryChain = (books: unknown[], total: number) => {
    const lean = vi.fn().mockResolvedValue(books);
    const limit = vi.fn().mockReturnValue({
      lean,
      skip: vi
        .fn()
        .mockReturnValue({ lean, limit: vi.fn().mockReturnValue({ lean }) }),
    });
    const skip = vi.fn().mockReturnValue({ limit, lean });
    const sort = vi.fn().mockReturnValue({ skip, limit, lean });
    const populate = vi.fn().mockReturnValue({ sort, skip, limit, lean });
    const find = vi.fn().mockReturnValue({ populate, sort, skip, limit, lean });
    const countDocuments = vi.fn().mockResolvedValue(total);

    vi.spyOn(Book, "find").mockImplementation(find);
    vi.spyOn(Book, "countDocuments").mockImplementation(countDocuments);

    return { find, populate, sort, skip, limit, lean, countDocuments };
  };

  it("should return books and meta correctly", async () => {
    const params: TBookSearchParamsDto = {
      page: 1,
      limit: 10,
      sort_by: "title",
      order: "asc",
    };
    const books: unknown[] = [{ title: "Book 1" }, { title: "Book 2" }];
    const total = 2;

    mockQueryChain(books, total);

    const result = await searchByFilters(params);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(books);
    expect(result.meta.total).toBe(total);
    expect(result.meta.page).toBe(1);
    expect(result.meta.limit).toBe(10);
    expect(result.meta.totalPages).toBe(1);
  });

  it("should apply filters correctly", async () => {
    const params: TBookSearchParamsDto = {
      q: "test",
      author: "John Doe",
      is_available: true,
      borrowed_by: "user123",

      page: 1,
      limit: 10,
      sort_by: "title",
      order: "asc",
    };

    const books = [{ title: "Book 1" }];
    const total = 1;

    const mocks = mockQueryChain(books, total);

    await searchByFilters(params);

    expect(mocks.find).toHaveBeenCalled();
    expect(mocks.populate).toHaveBeenCalledWith("borrowedBy");
    expect(mocks.sort).toHaveBeenCalledWith({ title: 1 });
    expect(mocks.skip).toHaveBeenCalledWith(0);
    expect(mocks.limit).toHaveBeenCalledWith(10);
  });

  it("should handle empty results", async () => {
    const params: TBookSearchParamsDto = {
      sort_by: "title",
      order: "asc",
      page: 1,
      limit: 10,
    };

    mockQueryChain([], 0);

    const result = await searchByFilters(params);

    expect(result.success).toBe(true);
    expect(result.data).toEqual([]);
    expect(result.meta.total).toBe(0);
    expect(result.meta.totalPages).toBe(0);
  });

  it("should propagate database errors", async () => {
    const params: TBookSearchParamsDto = {
      sort_by: "title",
      order: "asc",
      page: 1,
      limit: 10,
    };

    vi.spyOn(Book, "find").mockImplementation(() => {
      throw new Error("DB failed");
    });

    await expect(searchByFilters(params)).rejects.toThrow("DB failed");
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteBook } from "../deleteBook.service";
import Book from "@/models/Book";
import { TMongoIdDto } from "@/core/dto/monogId.dto";

vi.mock("@/models/Book");

describe("deleteBook service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete the book and return deleted document", async () => {
    const params: TMongoIdDto = { id: "book_id_123" };

    const mockDeletedBook = {
      _id: "book_id_123",
      title: "Clean Code",
      author: "Robert C. Martin",
    };

    const findByIdAndDeleteSpy = vi
      .spyOn(Book, "findByIdAndDelete")
      .mockResolvedValue(mockDeletedBook);

    const result = await deleteBook(params);

    expect(findByIdAndDeleteSpy).toHaveBeenCalledTimes(1);
    expect(findByIdAndDeleteSpy).toHaveBeenCalledWith(params.id);
    expect(result).toEqual(mockDeletedBook);
  });

  it("should return null if book does not exist", async () => {
    const params: TMongoIdDto = { id: "non_existent_id" };

    vi.spyOn(Book, "findByIdAndDelete").mockResolvedValue(null);

    const result = await deleteBook(params);

    expect(result).toBeNull();
  });

  it("should throw an error if database fails", async () => {
    const params: TMongoIdDto = { id: "book_id_456" };
    const dbError = new Error("Database error");

    vi.spyOn(Book, "findByIdAndDelete").mockRejectedValue(dbError);

    await expect(deleteBook(params)).rejects.toThrow("Database error");
  });
});

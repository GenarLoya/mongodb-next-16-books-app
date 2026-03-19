import { describe, it, expect, vi, beforeEach } from "vitest";
import { editBook } from "../editBook.service";
import Book from "@/models/Book";
import { TMongoIdDto } from "@/core/dto/monogId.dto";
import { TEditBookDto } from "../../_dto/editBook.dto";
import { NotFoundError } from "@/core/api/apiErrors";

// Mockeamos el modelo completo
vi.mock("@/models/Book");

describe("editBook service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1️⃣ Happy path: libro existe y se actualiza correctamente
  it("should update the book and return updated document", async () => {
    const params: TMongoIdDto = { id: "book_id_123" };
    const body: TEditBookDto = { title: "Updated Title" };

    const mockBook = {
      _id: params.id,
      title: "Old Title",
      author: "Author",
      set: vi.fn(),
      save: vi.fn().mockResolvedValue(true),
    };

    vi.spyOn(Book, "findById").mockResolvedValue(mockBook);

    const result = await editBook(params, body);

    expect(Book.findById).toHaveBeenCalledWith(params.id);
    expect(mockBook.set).toHaveBeenCalledWith(body);
    expect(mockBook.save).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockBook);
  });

  it("should throw NotFoundError if book does not exist", async () => {
    const params: TMongoIdDto = { id: "nonexistent_id" };
    const body: TEditBookDto = { title: "Title" };

    vi.spyOn(Book, "findById").mockResolvedValue(null);

    await expect(editBook(params, body)).rejects.toBeInstanceOf(NotFoundError);
    await expect(editBook(params, body)).rejects.toThrow("Book not found");
  });

  it("should propagate error if save fails", async () => {
    const params: TMongoIdDto = { id: "book_id_456" };
    const body: TEditBookDto = { author: "New Author" };

    const mockBook = {
      _id: params.id,
      title: "Old Title",
      author: "Author",
      set: vi.fn(),
      save: vi.fn().mockRejectedValue(new Error("Database save failed")),
    };

    vi.spyOn(Book, "findById").mockResolvedValue(mockBook);

    await expect(editBook(params, body)).rejects.toThrow(
      "Database save failed",
    );

    expect(mockBook.set).toHaveBeenCalledWith(body);
    expect(mockBook.save).toHaveBeenCalledTimes(1);
  });
});

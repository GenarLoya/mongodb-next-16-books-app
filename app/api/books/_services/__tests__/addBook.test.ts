import { describe, it, expect, vi, beforeEach } from "vitest";
import { addBook } from "../addBook.service";
import Book from "@/models/Book";
import { TAddBookdTO } from "../../_dto/addBook.dto";

vi.mock("@/models/Book");

describe("addBook service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create, save and return the book data", async () => {
    const mockBody: TAddBookdTO = {
      title: "Clean Code",
      author: "Robert C. Martin",
    };

    const mockSavedBook = {
      ...mockBody,
      _id: "mongodb_id_123",
    };

    const saveSpy = vi
      .spyOn(Book.prototype, "save")
      .mockResolvedValue(mockSavedBook);

    const result = await addBook(mockBody);

    expect(Book).toHaveBeenCalledWith(mockBody);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockSavedBook);
  });

  it("should throw an error if the database save fails", async () => {
    const mockBody: TAddBookdTO = { title: "Fail", author: "Author" };
    const dbError = new Error("Database connection lost");

    vi.spyOn(Book.prototype, "save").mockRejectedValue(dbError);

    await expect(addBook(mockBody)).rejects.toThrow("Database connection lost");
  });
});

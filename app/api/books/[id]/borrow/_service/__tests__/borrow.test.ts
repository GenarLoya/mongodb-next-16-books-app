import { describe, it, expect, vi, beforeEach } from "vitest";
import mongoose from "mongoose";
import { borrowBook } from "../borrow.service";
import Book from "@/models/Book";
import User from "@/models/User";
import { ConflictError, NotFoundError } from "@/core/api/apiErrors";

vi.mock("@/models/Book");
vi.mock("@/models/User");

describe("borrowBook service", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockSession: any;

  beforeEach(() => {
    vi.clearAllMocks();

    mockSession = {
      startTransaction: vi.fn(),
      commitTransaction: vi.fn(),
      abortTransaction: vi.fn(),
      endSession: vi.fn(),
    };

    vi.spyOn(mongoose, "startSession").mockResolvedValue(mockSession);
  });

  // 1️⃣ ✅ Happy path
  it("should borrow a book successfully", async () => {
    const body = { userId: "user123" };
    const params = { id: "book123" };

    const mockBook = { _id: "book123", borrowedBy: "user123" };
    const mockUser = { _id: "user123", borrowedBooks: ["book123"] };

    vi.spyOn(Book, "findOneAndUpdate").mockResolvedValue(mockBook);
    vi.spyOn(User, "findByIdAndUpdate").mockResolvedValue(mockUser);

    const result = await borrowBook(body, params);

    expect(mockSession.startTransaction).toHaveBeenCalled();

    expect(Book.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: params.id, borrowedBy: null },
      { borrowedBy: body.userId },
      expect.objectContaining({ session: mockSession }),
    );

    expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
      body.userId,
      { $addToSet: { borrowedBooks: mockBook._id } },
      expect.objectContaining({ session: mockSession }),
    );

    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(mockSession.abortTransaction).not.toHaveBeenCalled();

    expect(result).toEqual({
      book: mockBook,
      user: mockUser,
    });
  });

  it("should throw ConflictError if book is already borrowed or not found", async () => {
    const body = { userId: "user123" };
    const params = { id: "book123" };

    vi.spyOn(Book, "findOneAndUpdate").mockResolvedValue(null);

    await expect(borrowBook(body, params)).rejects.toBeInstanceOf(
      ConflictError,
    );

    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(mockSession.commitTransaction).not.toHaveBeenCalled();
  });

  it("should throw NotFoundError if user does not exist", async () => {
    const body = { userId: "user123" };
    const params = { id: "book123" };

    const mockBook = { _id: "book123" };

    vi.spyOn(Book, "findOneAndUpdate").mockResolvedValue(mockBook);
    vi.spyOn(User, "findByIdAndUpdate").mockResolvedValue(null);

    await expect(borrowBook(body, params)).rejects.toBeInstanceOf(
      NotFoundError,
    );

    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(mockSession.commitTransaction).not.toHaveBeenCalled();
  });

  it("should abort transaction if any error occurs", async () => {
    const body = { userId: "user123" };
    const params = { id: "book123" };

    vi.spyOn(Book, "findOneAndUpdate").mockRejectedValue(new Error("DB error"));

    await expect(borrowBook(body, params)).rejects.toThrow("DB error");

    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(mockSession.commitTransaction).not.toHaveBeenCalled();
  });
});
